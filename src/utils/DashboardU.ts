import { apiKey } from "../config/dev";
import { createCommentStatus } from "./WsFormat";
import UserComment from "../models/skipComment";
import axios from "axios";

export async function handleBardAI(commentText: string, videoInfo: any) {
  try {
    const response = await axios.get(`/api/llama2`, {
      params: {
        message: ` commentMessage='${commentText}' `,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error from Bard AI:", error);
    return "Default response if Brand AI fails";
  }
}

export const fetchChannels = async () => {
  try {
    const Token = await axios.get(
      "/auth/users/65e575c7dd5cb4199ec41667?key=AutoCommentIQ"
    );
    const accessToken = Token.data.accessToken; // Replace with your actual access token
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${accessToken}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data.items.id, "data");
    } else {
      throw new Error("Failed to fetch channels");
    }
  } catch (error) {
    console.error("Error fetching channels:", error);
  }
};

export const fetchVideoDetails = async (videoId: any) => {
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,id,liveStreamingDetails,localizations,player,recordingDetails,statistics,status,topicDetails&id=${videoId}&key=${apiKey}`
    );
    const data = await response.json();
    return data.items[0]; // Return the first video item
  } catch (error) {
    console.error("Error fetching video details:", error);
    return {};
  }
};

export const sendReply = async (parentId: any, replyText: any, ws?: any) => {
  const data = {
    snippet: {
      textOriginal: replyText.response,
      parentId: parentId,
    },
  };

  try {
    const Token = await axios.get(
      "/auth/users/65fe5822e41e389b5dcf2fec?key=AutoCommentIQ"
    );

    const accessToken = Token.data.accessToken; // Replace with your actual access token
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/comments?part=snippet,id`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (result?.snippet?.textOriginal) {
      try {
        const userId = "65e575c7dd5cb4199ec41667";

        // Check if the user with the given userId exists
        let existingUser = await UserComment.findOne({ userId });

        if (!existingUser) {
          // If user doesn't exist, create a new one
          existingUser = await UserComment.create({
            userId,
            user: userId,
            commentIds: ["parentId"], // Add parentId to the new user's commentIds array
          });
        } else {
          // If user exists, push parentId to the commentIds array
          existingUser.commentIds.push(parentId);
          await existingUser.save();
        }

        console.log("User and Comment updated:", existingUser);
        return result;
      } catch (error) {
        console.error(error);
      }
    }
    console.log("Reply sent:", result);
  } catch (error) {
    console.error("Error sending reply:", error);
  }
};

export const sendComment = async (
  videoId: any,
  setActiveAutoComment: any,
  ws?: any
) => {
  let commentCount = 0;
  let totalLoadingTime = 0;
  const userId = "65e575c7dd5cb4199ec41667";
  const videoDetailsArray = []; // Array to store video details for each comment
  const commentsArray = [];
  const AiResponseArray = [];
  var successCount: any = 0;
  const PerCommentTime = [];
  const StatusArray = [];
  var pendingCount: any = 0;
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&part=replies&videoId=${videoId}&key=${apiKey}&maxResults=2000`
    );
    const data = await response.json();
    const comments = data.items || [];

    const SkipCommenter = await UserComment.findOne({ userId });
    console.log(SkipCommenter, "SkipCommenter");

    const skipUserComments = comments.filter((comment: any) => {
      // Check if the author's display name is not "@gokulakrishnanr8414"
      const isNotGokula =
        comment?.snippet?.topLevelComment?.snippet?.authorDisplayName !==
        "@gokulakrishnanr8414";

      // Check if the comment ID is not in the SkipCommenter's commentIds array
      const isNotSkippedComment = !SkipCommenter?.commentIds.includes(
        comment?.snippet?.topLevelComment?.id
      );

      // Return true if both conditions are met, indicating the comment should not be skipped
      return isNotGokula && isNotSkippedComment;
    });
    console.log(skipUserComments, "skipUserComments");

    commentsArray.push(skipUserComments);

    const videoDetails = await fetchVideoDetails(videoId);
    videoDetailsArray.push(videoDetails); // Store video details for each comment

    // Notify client about the overall comment processing starting
    videoDetailsArray.push(videoDetails); // Store video details for each comment
    pendingCount = skipUserComments.length;
    const commentStatus = createCommentStatus({
      commentId: "",
      type: "commentStatus",
      pendingComment: pendingCount,
      totalCommentCount: pendingCount,
      processingTime: new Date().getTime() - new Date().getTime(),
      totalLoadingTime: 0,
      successCount: successCount,
      errorCount: 0,
      videoId: videoId,
      commentCount: 0,
      perCommnetTime: PerCommentTime,
      videoDetailsArray: commentsArray,
      completedComment: 0,
      failedComment: 0,
      replyComment: AiResponseArray,
      status: StatusArray,
    });

    ws.send(JSON.stringify(commentStatus));

    for (const comment of skipUserComments) {
      const startProcessingTime = performance.now(); // Start time for processing each comment
      const parentId = comment.snippet.topLevelComment.id;
      const commentText = comment.snippet.topLevelComment.snippet.textOriginal;

      const videoInfo = {
        title: videoDetails.snippet.title,
        description: videoDetails.snippet.description,
        tags: videoDetails.snippet.tags,
        channelTitle: videoDetails.snippet.channelTitle,
      };

      const commentStatus = createCommentStatus({
        commentId: parentId,
        type: "commentStatus",
        pendingComment: pendingCount,
        totalCommentCount: pendingCount,
        processingTime: new Date().getTime() - new Date().getTime(),
        totalLoadingTime: 0,
        successCount: successCount,
        errorCount: 0,
        videoId: videoId,
        commentCount: 0,
        perCommnetTime: PerCommentTime,
        videoDetailsArray: commentsArray,
        completedComment: 0,
        failedComment: 0,
        commentArray: comment,
        replyComment: AiResponseArray,
        status: StatusArray,
      });

      ws.send(JSON.stringify(commentStatus));

      const bardResponse = await handleBardAI(commentText, videoInfo);

      const FinalResult: any = await sendReply(parentId, bardResponse, ws);
      const checkStatus = FinalResult?.snippet?.textOriginal;
      AiResponseArray.push(checkStatus ? bardResponse : "failed");
      console.log(FinalResult, "FinalResult");

      const endProcessingTime = performance.now(); // End time for processing each comment
      const commentLoadingTime = endProcessingTime - startProcessingTime;

      const commentLoadingTimeInSeconds = (commentLoadingTime / 1000).toFixed(
        2
      );

      PerCommentTime.push(commentLoadingTimeInSeconds + "S");
      totalLoadingTime += commentLoadingTime;
      commentCount++;

      StatusArray.push(checkStatus ? "success" : "failed");
      console.log(`Total time to process all comments: ${totalLoadingTime}ms`);
      // Notify client about the completion of comment processing
      // setTimeout(() => {
      if (checkStatus) {
        pendingCount = pendingCount - 1;
        successCount = successCount + 1;
        const AfterComplete = createCommentStatus({
          commentId: "",
          status: StatusArray,
          type: "commentStatus",
          pendingComment: pendingCount,
          totalCommentCount: pendingCount,
          processingTime: commentLoadingTime,
          totalLoadingTime: totalLoadingTime,
          successCount: successCount,
          errorCount: 0,
          videoId: videoId,
          commentCount: commentCount,
          perCommnetTime: PerCommentTime,
          videoDetailsArray: commentsArray,
          completedComment: commentCount,
          failedComment: 0,
          toastMessage: `Comment ${commentCount} processed in ${commentLoadingTime}ms \n Total time to process all comments: ${totalLoadingTime}ms`,
          replyComment: AiResponseArray,
        });

        ws.send(JSON.stringify(AfterComplete));
      }

      // }, 5500);
    }
  } catch (error) {
    console.error("Error fetching comments:", error);

    // Notify client about the failure in comment processing
    const processingFailureStatus = createCommentStatus({
      type: "processingFailure",
      errorCount: 1,
      videoId: videoId,
    });
    ws.send(JSON.stringify(processingFailureStatus));
  }
};

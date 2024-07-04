"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendComment =
  exports.sendReply =
  exports.fetchVideoDetails =
  exports.fetchChannels =
  exports.handleBardAI =
    void 0;
const axios_1 = __importDefault(require("axios"));
const dev_1 = require("../config/dev");
const WsFormat_1 = require("./WsFormat");
const skipComment_1 = __importDefault(require("../models/skipComment"));
function handleBardAI(commentText, videoInfo) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const response = yield axios_1.default.get(
        `https://autocommentapi.vercel.app/api/llama2`,
        {
          params: {
            message: ` commentMessage='${commentText}' `,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error from Bard AI:", error);
      return "Default response if Brand AI fails";
    }
  });
}
exports.handleBardAI = handleBardAI;
const fetchChannels = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const Token = yield axios_1.default.get(
        "https://autocommentapi.vercel.app/auth/users/65e575c7dd5cb4199ec41667?key=AutoCommentIQ"
      );
      const accessToken = Token.data.accessToken; // Replace with your actual access token
      const response = yield fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${accessToken}`
      );
      if (response.ok) {
        const data = yield response.json();
        console.log(data.items.id, "data");
      } else {
        throw new Error("Failed to fetch channels");
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  });
exports.fetchChannels = fetchChannels;
const fetchVideoDetails = (videoId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const response = yield fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,id,liveStreamingDetails,localizations,player,recordingDetails,statistics,status,topicDetails&id=${videoId}&key=${dev_1.apiKey}`
      );
      const data = yield response.json();
      return data.items[0]; // Return the first video item
    } catch (error) {
      console.error("Error fetching video details:", error);
      return {};
    }
  });
exports.fetchVideoDetails = fetchVideoDetails;
const sendReply = (parentId, replyText, ws) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = {
      snippet: {
        textOriginal: replyText.response,
        parentId: parentId,
      },
    };
    try {
      const Token = yield axios_1.default.get(
        "https://autocommentapi.vercel.app/auth/users/65fe5822e41e389b5dcf2fec?key=AutoCommentIQ"
      );
      const accessToken = Token.data.accessToken; // Replace with your actual access token
      const response = yield fetch(
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
      const result = yield response.json();
      if (
        (_a =
          result === null || result === void 0 ? void 0 : result.snippet) ===
          null || _a === void 0
          ? void 0
          : _a.textOriginal
      ) {
        try {
          const userId = "65e575c7dd5cb4199ec41667";
          // Check if the user with the given userId exists
          let existingUser = yield skipComment_1.default.findOne({ userId });
          if (!existingUser) {
            // If user doesn't exist, create a new one
            existingUser = yield skipComment_1.default.create({
              userId,
              user: userId,
              commentIds: ["parentId"], // Add parentId to the new user's commentIds array
            });
          } else {
            // If user exists, push parentId to the commentIds array
            existingUser.commentIds.push(parentId);
            yield existingUser.save();
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
  });
exports.sendReply = sendReply;
const sendComment = (videoId, setActiveAutoComment, ws) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let commentCount = 0;
    let totalLoadingTime = 0;
    const userId = "65e575c7dd5cb4199ec41667";
    const videoDetailsArray = []; // Array to store video details for each comment
    const commentsArray = [];
    const AiResponseArray = [];
    var successCount = 0;
    const PerCommentTime = [];
    const StatusArray = [];
    var pendingCount = 0;
    try {
      const response = yield fetch(
        `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&part=replies&videoId=${videoId}&key=${dev_1.apiKey}&maxResults=2000`
      );
      const data = yield response.json();
      const comments = data.items || [];
      const SkipCommenter = yield skipComment_1.default.findOne({ userId });
      console.log(SkipCommenter, "SkipCommenter");
      const skipUserComments = comments.filter((comment) => {
        var _a, _b, _c, _d, _e;
        // Check if the author's display name is not "@gokulakrishnanr8414"
        const isNotGokula =
          ((_c =
            (_b =
              (_a =
                comment === null || comment === void 0
                  ? void 0
                  : comment.snippet) === null || _a === void 0
                ? void 0
                : _a.topLevelComment) === null || _b === void 0
              ? void 0
              : _b.snippet) === null || _c === void 0
            ? void 0
            : _c.authorDisplayName) !== "@gokulakrishnanr8414";
        // Check if the comment ID is not in the SkipCommenter's commentIds array
        const isNotSkippedComment = !(SkipCommenter === null ||
        SkipCommenter === void 0
          ? void 0
          : SkipCommenter.commentIds.includes(
              (_e =
                (_d =
                  comment === null || comment === void 0
                    ? void 0
                    : comment.snippet) === null || _d === void 0
                  ? void 0
                  : _d.topLevelComment) === null || _e === void 0
                ? void 0
                : _e.id
            ));
        // Return true if both conditions are met, indicating the comment should not be skipped
        return isNotGokula && isNotSkippedComment;
      });
      console.log(skipUserComments, "skipUserComments");
      commentsArray.push(skipUserComments);
      const videoDetails = yield (0, exports.fetchVideoDetails)(videoId);
      videoDetailsArray.push(videoDetails); // Store video details for each comment
      // Notify client about the overall comment processing starting
      videoDetailsArray.push(videoDetails); // Store video details for each comment
      pendingCount = skipUserComments.length;
      const commentStatus = (0, WsFormat_1.createCommentStatus)({
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
        const commentText =
          comment.snippet.topLevelComment.snippet.textOriginal;
        const videoInfo = {
          title: videoDetails.snippet.title,
          description: videoDetails.snippet.description,
          tags: videoDetails.snippet.tags,
          channelTitle: videoDetails.snippet.channelTitle,
        };
        const commentStatus = (0, WsFormat_1.createCommentStatus)({
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
        const bardResponse = yield handleBardAI(commentText, videoInfo);
        const FinalResult = yield (0, exports.sendReply)(
          parentId,
          bardResponse,
          ws
        );
        const checkStatus =
          (_b =
            FinalResult === null || FinalResult === void 0
              ? void 0
              : FinalResult.snippet) === null || _b === void 0
            ? void 0
            : _b.textOriginal;
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
        console.log(
          `Total time to process all comments: ${totalLoadingTime}ms`
        );
        // Notify client about the completion of comment processing
        // setTimeout(() => {
        if (checkStatus) {
          pendingCount = pendingCount - 1;
          successCount = successCount + 1;
          const AfterComplete = (0, WsFormat_1.createCommentStatus)({
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
      const processingFailureStatus = (0, WsFormat_1.createCommentStatus)({
        type: "processingFailure",
        errorCount: 1,
        videoId: videoId,
      });
      ws.send(JSON.stringify(processingFailureStatus));
    }
  });
exports.sendComment = sendComment;
//# sourceMappingURL=DashboardU.js.map

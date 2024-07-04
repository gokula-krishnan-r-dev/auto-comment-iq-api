import { Request, Response, Router } from "express";
import { getComments } from "../../utils/NegativeComment";
import { timeAgoString } from "../../utils/TimeOut";
import { formatLikeCount } from "../../utils/formateLikeCount";
import axios from "axios";

const NegativeCommentRouter = Router();

// NegativeCommentRouter.get("/comments", async (req: Request, res: Response) => {
//   try {
//     const videoId = req.query.videoId as string;
//     const sentiment = req.query.sentiment || ("positive" as string);

//     const nextPageToken = req.query.nextPageToken as string;
//     const comments = await getComments(videoId, nextPageToken);
//     if (comments instanceof Error) {
//       throw comments;
//     }

//     res.json({
//       comment: comments.items,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

NegativeCommentRouter.get(
  "/comment-ios",
  async (req: Request, res: Response) => {
    try {
      const videoId = req.query.videoId as string;
      const sentiment = req.query.sentiment || ("positive" as string);

      const nextPageToken = req.query.nextPageToken as string;
      const comments = await getComments(videoId, nextPageToken);
      if (comments instanceof Error) {
        throw comments;
      }

      const formattedComments = comments?.items?.map((comment) => {
        // Ensure replies is an array before mapping over it
        const replies = Array.isArray(comment?.replies?.comments)
          ? comment?.replies?.comments?.map((reply) => {
              const replySnippet = reply.snippet;

              return {
                textOriginal: replySnippet.textOriginal,
                authorDisplayName: replySnippet.authorDisplayName,
                authorProfileImageUrl: replySnippet.authorProfileImageUrl,
                channelId: replySnippet.channelId,
                videoId: replySnippet.videoId,
                likeCount: formatLikeCount(replySnippet.likeCount),
                publishedAt: replySnippet.publishedAt,
                parentId: replySnippet.id,
                updatedAt: timeAgoString(new Date(replySnippet.updatedAt)),
              };
            })
          : [];
        return {
          textOriginal: comment.snippet.topLevelComment.snippet.textOriginal,
          authorDisplayName:
            comment.snippet.topLevelComment.snippet.authorDisplayName,
          authorProfileImageUrl:
            comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
          channelId: comment.snippet.topLevelComment.snippet.channelId,
          videoId: comment.snippet.topLevelComment.snippet.videoId,
          likeCount: formatLikeCount(
            comment.snippet.topLevelComment.snippet.likeCount
          ),
          publishedAt: comment.snippet.topLevelComment.snippet.publishedAt,
          updatedAt: timeAgoString(
            new Date(comment.snippet.topLevelComment.snippet.updatedAt) as Date
          ),
          replieCount: comment.snippet.totalReplyCount,
          replies: replies,
          nextPageToken: comments.nextPageToken,
          parentId: comment.id,
        };
      });

      res.json({
        comments: formattedComments,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// NegativeCommentRouter.get("/comments", async (req, res) => {
//   try {
//     const videoId = req.query.videoId as string;
//     const nextPageToken = req.query.nextPageToken as string;
//     const comments = await getComments(videoId, nextPageToken);
//     if (comments instanceof Error) {
//       throw comments;
//     }

//     // Analyze sentiment for each comment
//     const commentsWithSentiment = await Promise.all(
//       comments.items.map(async (comment) => {
//         try {
//           const sentimentAnalysis = await analyzeSentiment(comment.text);
//           return {
//             ...comment,
//             sentiment: sentimentAnalysis,
//           };
//         } catch (error) {
//           console.error("Error analyzing sentiment for comment:", error);
//           return {
//             ...comment,
//             sentiment: { error: "Sentiment analysis failed" }, // Placeholder for failed analysis
//           };
//         }
//       })
//     );

//     res.json({
//       comments: commentsWithSentiment,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

NegativeCommentRouter.get("/comments", async (req: Request, res: Response) => {
  try {
    const videoId = req.query.videoId as string;
    const sentiment = req.query.sentiment || ("positive" as string);
    const language = req.query.language || ("en" as string);
    const nextPageToken = req.query.nextPageToken as string;
    const comments = await getComments(videoId, nextPageToken);
    if (comments instanceof Error) {
      throw comments;
    }
    if (language !== "English" || sentiment !== "all Comment") {
      const commentsWithSentiment = await Promise.all(
        comments.items.map(async (comment) => {
          try {
            const topLevelComment = comment.snippet.topLevelComment;
            const textDisplay = topLevelComment.snippet.textDisplay;

            const sentimentAnalysis = await analyzeSentiment(textDisplay);

            const languageTranslation = await translationText(
              textDisplay,
              language.toString()
            );

            topLevelComment.snippet.textDisplay =
              languageTranslation.translated_text;

            return {
              ...comment,
              sentiment: sentimentAnalysis.sentiment || "neutral",
              polarity: sentimentAnalysis.polarity || 0,
            };
          } catch (error) {
            console.error("Error analyzing sentiment for comment:", error);
            return { ...comment, sentiment: "unknown" };
          }
        })
      );
      const filteredComments =
        sentiment === "all Comment"
          ? commentsWithSentiment
          : commentsWithSentiment.filter(
              (comment) => comment.sentiment === sentiment
            );
      res.json({
        comment: filteredComments,
      });
    } else {
      res.json({
        comment: comments.items,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
async function translationText(comment: string, language: string) {
  const response = await axios.get(
    `http://127.0.0.1:8000/translate?text=${comment}&target_language=${language}`
  );
  console.log(response.data, "response gokula");

  return response.data;
}

async function analyzeSentiment(comment: string) {
  const response = await axios.get(
    `http://127.0.0.1:8000/sentiment?text=${comment}`
  );

  return response.data;
}

export default NegativeCommentRouter;

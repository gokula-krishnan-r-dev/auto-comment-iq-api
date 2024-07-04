"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NegativeComment_1 = require("../../utils/NegativeComment");
const TimeOut_1 = require("../../utils/TimeOut");
const formateLikeCount_1 = require("../../utils/formateLikeCount");
const axios_1 = __importDefault(require("axios"));
const NegativeCommentRouter = (0, express_1.Router)();
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
NegativeCommentRouter.get("/comment-ios", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const videoId = req.query.videoId;
        const sentiment = req.query.sentiment || "positive";
        const nextPageToken = req.query.nextPageToken;
        const comments = yield (0, NegativeComment_1.getComments)(videoId, nextPageToken);
        if (comments instanceof Error) {
            throw comments;
        }
        const formattedComments = (_a = comments === null || comments === void 0 ? void 0 : comments.items) === null || _a === void 0 ? void 0 : _a.map((comment) => {
            var _a, _b, _c;
            // Ensure replies is an array before mapping over it
            const replies = Array.isArray((_a = comment === null || comment === void 0 ? void 0 : comment.replies) === null || _a === void 0 ? void 0 : _a.comments)
                ? (_c = (_b = comment === null || comment === void 0 ? void 0 : comment.replies) === null || _b === void 0 ? void 0 : _b.comments) === null || _c === void 0 ? void 0 : _c.map((reply) => {
                    const replySnippet = reply.snippet;
                    return {
                        textOriginal: replySnippet.textOriginal,
                        authorDisplayName: replySnippet.authorDisplayName,
                        authorProfileImageUrl: replySnippet.authorProfileImageUrl,
                        channelId: replySnippet.channelId,
                        videoId: replySnippet.videoId,
                        likeCount: (0, formateLikeCount_1.formatLikeCount)(replySnippet.likeCount),
                        publishedAt: replySnippet.publishedAt,
                        parentId: replySnippet.id,
                        updatedAt: (0, TimeOut_1.timeAgoString)(new Date(replySnippet.updatedAt)),
                    };
                })
                : [];
            return {
                textOriginal: comment.snippet.topLevelComment.snippet.textOriginal,
                authorDisplayName: comment.snippet.topLevelComment.snippet.authorDisplayName,
                authorProfileImageUrl: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
                channelId: comment.snippet.topLevelComment.snippet.channelId,
                videoId: comment.snippet.topLevelComment.snippet.videoId,
                likeCount: (0, formateLikeCount_1.formatLikeCount)(comment.snippet.topLevelComment.snippet.likeCount),
                publishedAt: comment.snippet.topLevelComment.snippet.publishedAt,
                updatedAt: (0, TimeOut_1.timeAgoString)(new Date(comment.snippet.topLevelComment.snippet.updatedAt)),
                replieCount: comment.snippet.totalReplyCount,
                replies: replies,
                nextPageToken: comments.nextPageToken,
                parentId: comment.id,
            };
        });
        res.json({
            comments: formattedComments,
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
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
NegativeCommentRouter.get("/comments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoId = req.query.videoId;
        const sentiment = req.query.sentiment || "positive";
        const language = req.query.language || "en";
        const nextPageToken = req.query.nextPageToken;
        const comments = yield (0, NegativeComment_1.getComments)(videoId, nextPageToken);
        if (comments instanceof Error) {
            throw comments;
        }
        if (language !== "English" || sentiment !== "all Comment") {
            const commentsWithSentiment = yield Promise.all(comments.items.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const topLevelComment = comment.snippet.topLevelComment;
                    const textDisplay = topLevelComment.snippet.textDisplay;
                    const sentimentAnalysis = yield analyzeSentiment(textDisplay);
                    const languageTranslation = yield translationText(textDisplay, language.toString());
                    topLevelComment.snippet.textDisplay =
                        languageTranslation.translated_text;
                    return Object.assign(Object.assign({}, comment), { sentiment: sentimentAnalysis.sentiment || "neutral", polarity: sentimentAnalysis.polarity || 0 });
                }
                catch (error) {
                    console.error("Error analyzing sentiment for comment:", error);
                    return Object.assign(Object.assign({}, comment), { sentiment: "unknown" });
                }
            })));
            const filteredComments = sentiment === "all Comment"
                ? commentsWithSentiment
                : commentsWithSentiment.filter((comment) => comment.sentiment === sentiment);
            res.json({
                comment: filteredComments,
            });
        }
        else {
            res.json({
                comment: comments.items,
            });
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
function translationText(comment, language) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`http://127.0.0.1:8000/translate?text=${comment}&target_language=${language}`);
        console.log(response.data, "response gokula");
        return response.data;
    });
}
function analyzeSentiment(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`http://127.0.0.1:8000/sentiment?text=${comment}`);
        return response.data;
    });
}
exports.default = NegativeCommentRouter;
//# sourceMappingURL=NegativeCommentRouter.js.map
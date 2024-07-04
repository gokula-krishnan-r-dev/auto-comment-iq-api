import express, { Router } from "express";
import YtRouter from "./ytRouter/ytRoute";
import bardRouter from "./Bard-Router/bard-router";
import AIRouter from "./AIRouter/AiRouter";
import commentRoute from "./commentRoute/commentRoute";
import RoomRoute from "./RoomRoute";
import RoomStroyRoute from "./StoryRouter/RoomStroyRoute";
import PollRouter from "./PollRouter/PollRouter";
import JobAdsRouter from "./JobadsRouter/JobadsRouter";
import AdsRouter from "./ChatAdsRouter/AdsRouter";
import PinCommentRouter from "./PinCommentRouter/PinCommentRouter";
import ImageUploadRouter from "./ImageUploadRouter/ImageUploadRouter";
import SendMessageRouter from "./SendMessageRouter/SendMessageRouter";
import CollaborationRouter from "./CollaborationRouter";
import AiChatRouter from "./AiChatRouter";
import NegativeCommentRouter from "./NegativeCommentRouter/NegativeCommentRouter";
import youtubeanalyticsRouter from "./youtubeAnalyticsRouter";
import onlineRouter from "./onlineRouter";
import DailyIdea from "./DailyIdeaRouter/DailyIdeaRouter";
import WathosRouter from "./WatchosRouter/WatchosRouter";
import CompetitorRouter from "./CompetitorRouter/CompetitorRouter";
import LiveStreamRouter from "./LiveStreamRouter/LiveStreamRouter";
import { MessageModel } from "../models/ai.model";
const RouterApp = express.Router();

RouterApp.use("", YtRouter);
RouterApp.use("", bardRouter);
RouterApp.use("", AIRouter);
RouterApp.use("/reply", commentRoute);
RouterApp.use("", RoomRoute);
RouterApp.use("/story", RoomStroyRoute);
RouterApp.use("/poll", PollRouter);
RouterApp.use("/jobads", JobAdsRouter);
RouterApp.use("/ads", AdsRouter);
RouterApp.use("/message", PinCommentRouter);
RouterApp.use("/message", ImageUploadRouter);
RouterApp.use("/message", SendMessageRouter);
RouterApp.use("/collaboration", CollaborationRouter);
RouterApp.use("/ai-chat", AiChatRouter);
RouterApp.use("/negative", NegativeCommentRouter);
RouterApp.use("/youtube-analytics", youtubeanalyticsRouter);
RouterApp.use("/online-user", onlineRouter);
RouterApp.use("/daily", DailyIdea);
RouterApp.use("/watchos", WathosRouter);
RouterApp.use("/competitor", CompetitorRouter);
RouterApp.use("/live-stream", LiveStreamRouter);

// API endpoint to get messages for a room
RouterApp.get("/api/messages/:roomId", async (req: any, res: any) => {
  try {
    const roomId = req.params.roomId;
    const messages: any[] = await MessageModel.find({ roomId })
      .populate("userId")
      .populate("pollId")
      .populate("userId")
      .populate("emotes.user")
      .sort("timestamp");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default RouterApp;

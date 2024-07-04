"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ytRoute_1 = __importDefault(require("./ytRouter/ytRoute"));
const bard_router_1 = __importDefault(require("./Bard-Router/bard-router"));
const AiRouter_1 = __importDefault(require("./AIRouter/AiRouter"));
const commentRoute_1 = __importDefault(require("./commentRoute/commentRoute"));
const RoomRoute_1 = __importDefault(require("./RoomRoute"));
const RoomStroyRoute_1 = __importDefault(require("./StoryRouter/RoomStroyRoute"));
const PollRouter_1 = __importDefault(require("./PollRouter/PollRouter"));
const JobadsRouter_1 = __importDefault(require("./JobadsRouter/JobadsRouter"));
const AdsRouter_1 = __importDefault(require("./ChatAdsRouter/AdsRouter"));
const PinCommentRouter_1 = __importDefault(require("./PinCommentRouter/PinCommentRouter"));
const ImageUploadRouter_1 = __importDefault(require("./ImageUploadRouter/ImageUploadRouter"));
const SendMessageRouter_1 = __importDefault(require("./SendMessageRouter/SendMessageRouter"));
const CollaborationRouter_1 = __importDefault(require("./CollaborationRouter"));
const AiChatRouter_1 = __importDefault(require("./AiChatRouter"));
const NegativeCommentRouter_1 = __importDefault(require("./NegativeCommentRouter/NegativeCommentRouter"));
const youtubeAnalyticsRouter_1 = __importDefault(require("./youtubeAnalyticsRouter"));
const onlineRouter_1 = __importDefault(require("./onlineRouter"));
const DailyIdeaRouter_1 = __importDefault(require("./DailyIdeaRouter/DailyIdeaRouter"));
const WatchosRouter_1 = __importDefault(require("./WatchosRouter/WatchosRouter"));
const CompetitorRouter_1 = __importDefault(require("./CompetitorRouter/CompetitorRouter"));
const LiveStreamRouter_1 = __importDefault(require("./LiveStreamRouter/LiveStreamRouter"));
const RouterApp = express_1.default.Router();
RouterApp.use("", ytRoute_1.default);
RouterApp.use("", bard_router_1.default);
RouterApp.use("", AiRouter_1.default);
RouterApp.use("/reply", commentRoute_1.default);
RouterApp.use("", RoomRoute_1.default);
RouterApp.use("/story", RoomStroyRoute_1.default);
RouterApp.use("/poll", PollRouter_1.default);
RouterApp.use("/jobads", JobadsRouter_1.default);
RouterApp.use("/ads", AdsRouter_1.default);
RouterApp.use("/message", PinCommentRouter_1.default);
RouterApp.use("/message", ImageUploadRouter_1.default);
RouterApp.use("/message", SendMessageRouter_1.default);
RouterApp.use("/collaboration", CollaborationRouter_1.default);
RouterApp.use("/ai-chat", AiChatRouter_1.default);
RouterApp.use("/negative", NegativeCommentRouter_1.default);
RouterApp.use("/youtube-analytics", youtubeAnalyticsRouter_1.default);
RouterApp.use("/online-user", onlineRouter_1.default);
RouterApp.use("/daily", DailyIdeaRouter_1.default);
RouterApp.use("/watchos", WatchosRouter_1.default);
RouterApp.use("/competitor", CompetitorRouter_1.default);
RouterApp.use("/live-stream", LiveStreamRouter_1.default);
exports.default = RouterApp;
//# sourceMappingURL=route.js.map
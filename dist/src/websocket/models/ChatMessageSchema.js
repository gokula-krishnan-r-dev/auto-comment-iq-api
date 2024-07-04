"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rooms = exports.ChatMessageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const rooms = {};
exports.rooms = rooms;
const ChatMessageSchema = new mongoose_1.default.Schema({
    room: { type: String },
    sender: { type: String },
    device: { type: String },
    message: { type: String },
    timestamp: { type: Date },
});
const ChatMessageModel = mongoose_1.default.model("ChatMessage", ChatMessageSchema);
exports.ChatMessageModel = ChatMessageModel;
//# sourceMappingURL=ChatMessageSchema.js.map
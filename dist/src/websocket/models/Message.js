"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const MessageSchema = new mongoose_1.Schema({
    message: { type: String },
    roomId: { type: String },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "users" },
    image: { type: String },
    type: { type: String, default: "text" },
    videoId: { type: String },
    heart: { type: Boolean, default: false },
    pollId: { type: mongoose_1.Schema.Types.ObjectId, ref: "polls" },
    replyMessage: { type: String },
    replyTo: {
        messageId: { type: String },
        username: { type: String },
    },
    image_text: { type: String },
    emotes: [
        {
            emoteString: { type: String },
            userId: { type: String }, // Reference to User model
            user: { type: mongoose_1.Schema.Types.ObjectId, ref: "users" }, // Reference to User model
            roomId: { type: String },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const MessageModel = mongoose_1.default.model("Message", MessageSchema);
exports.default = MessageModel;
//# sourceMappingURL=Message.js.map
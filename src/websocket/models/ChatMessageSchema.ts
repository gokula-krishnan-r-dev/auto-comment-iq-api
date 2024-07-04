import mongoose from "mongoose";

interface ChatMessage {
  room?: string;
  sender: string;
  device: string;
  message: string;
  timestamp: Date;
}
interface Room {
  users: Record<string, string>;
}
const rooms: any = {};

const ChatMessageSchema = new mongoose.Schema<ChatMessage>({
  room: { type: String },
  sender: { type: String },
  device: { type: String },
  message: { type: String },
  timestamp: { type: Date },
});

const ChatMessageModel = mongoose.model<ChatMessage>(
  "ChatMessage",
  ChatMessageSchema
);

export { ChatMessageModel, rooms, Room };

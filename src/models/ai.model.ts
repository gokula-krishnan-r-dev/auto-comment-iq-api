// models/message.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  message: string;
  sender: string;
  user: string;
  userId: string;
}

const MessageSchema = new Schema(
  {
    message: { type: String, required: true },
    sender: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<IMessage>("aichats", MessageSchema);

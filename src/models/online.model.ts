// src/models/OnlineUser.ts
import { Schema, model, Document, Types } from "mongoose";

export interface OnlineUser extends Document {
  userId: string;
  roomId: string;
  user?: Types.ObjectId[];
  isOnline: boolean;
}

const onlineUserSchema = new Schema(
  {
    userId: { type: String, required: true },
    roomId: { type: String, required: true },
    user: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  {
    timestamps: true,
    unique: true,
  }
);

const onlineUser = model<OnlineUser>("OnlineUser", onlineUserSchema);

export default onlineUser;

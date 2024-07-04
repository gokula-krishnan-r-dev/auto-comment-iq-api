import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "../websocket/models/Message";

export interface IPin extends Document {
  userId: mongoose.Types.ObjectId | any;
  messageId: mongoose.Types.ObjectId | IMessage | any;
  roomId: mongoose.Types.ObjectId | any;
  room: string;
  pinType: string;
  createdAt: Date;
  updatedAt: Date;
}

const pinSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  messageId: { type: Schema.Types.ObjectId, ref: "Message" },
  roomId: { type: Schema.Types.ObjectId, ref: "Room" },
  room: { type: String, default: "", required: true },
  pinType: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPin>("pin", pinSchema);

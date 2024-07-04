// rooms.ts
import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "../../models/user.model";

interface IRoom extends Document {
  name: string;
  roomId: string;
  userId: Types.ObjectId | IUser | any; // Use Types.ObjectId for referencing User model
  authorId?: Types.ObjectId;
  videoId?: string;
  user: IUser | any;
  isOnline?: boolean;
  isLeft?: Date;
  channel_name: string;
  onlineUsers: Types.ObjectId[];
  channel_id: string;
  video_title: string;
  channel_logo: string;
  video_thumbnail: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

const roomsSchema: Schema<IRoom> = new Schema({
  name: String,
  roomId: String,
  userId: { type: Schema.Types.ObjectId }, // Reference to User model
  authorId: { type: Schema.Types.ObjectId },
  videoId: String,
  onlineUsers: [{ type: Schema.Types.ObjectId, ref: "users" }],
  isOnline: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "users" },
  isLeft: { type: Date, default: Date.now },
  channel_name: String,
  channel_id: String,
  video_title: String,
  channel_logo: String,
  video_thumbnail: String,
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
});

const Room = mongoose.model<IRoom>("Room", roomsSchema);
export default Room;

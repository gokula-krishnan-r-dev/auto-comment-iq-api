import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "../../models/user.model";
import { IPoll } from "../../models/poll.model";

export interface IMessage extends Document {
  message?: string;
  roomId?: string;
  userId?: Types.ObjectId | IUser | any;
  image?: string;
  type?: string;
  videoId?: string;
  heart?: boolean;
  pollId?: Types.ObjectId | IPoll | any;
  image_text?: string;
  emotes?: [
    {
      emoteString: string;
      user: Types.ObjectId | IUser | any;
      userId: string;
      roomId: string;
    }
  ];
  replyMessage?: string;
  replyTo?: {
    messageId?: string;
    username?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema: Schema = new Schema({
  message: { type: String },
  roomId: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  image: { type: String },
  type: { type: String, default: "text" },
  videoId: { type: String },
  heart: { type: Boolean, default: false },
  pollId: { type: Schema.Types.ObjectId, ref: "polls" },
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
      user: { type: Schema.Types.ObjectId, ref: "users" }, // Reference to User model
      roomId: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;

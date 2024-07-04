import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICompetitor extends Document {
  userId: Types.ObjectId;
  user: Types.ObjectId;
  channelId: string;
  channelName?: string;
  channelAvatar?: string;
}

const CompetitorSchema: Schema = new Schema({
  userId: { type: Types.ObjectId, required: true },
  user: { type: Types.ObjectId, required: true, ref: "users" },
  channelId: { type: String, required: true },
  channelName: { type: String },
  channelAvatar: { type: String },
});

export default mongoose.model<ICompetitor>("competitors", CompetitorSchema);

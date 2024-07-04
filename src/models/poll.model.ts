import mongoose, { Document, Schema, Model, model, Types } from "mongoose";

export interface IPoll extends Document {
  url?: string;
  type: string;
  roomId: string;
  user: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  question?: string;
  options?: string[];
  isUrl?: boolean;
  votes?: IVote[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVote {
  option: string;
  user: { type: Schema.Types.ObjectId; ref: "users"; required: true };
  userId: { type: Schema.Types.ObjectId };
  roomId: string;
  type: string;
  updatedAt: Date;
  createdAt: Date;
}

const VoteSchema: Schema<IVote> = new Schema<IVote>({
  option: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  userId: { type: Schema.Types.ObjectId },
  type: { type: String, required: true },
  roomId: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const PollSchema: Schema<IPoll> = new Schema<IPoll>({
  url: { type: String },
  type: { type: String, required: true },
  roomId: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  question: String,
  options: [String],
  isUrl: Boolean,
  votes: [VoteSchema], // Added the votes field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PollModel: Model<IPoll> = model<IPoll>("polls", PollSchema);

export default PollModel;

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserComment extends Document {
  user: { type: Schema.Types.ObjectId; ref: "users"; required: true };
  userId: { type: Schema.Types.ObjectId };
  commentIds: string[];
}

const UserCommentSchema: Schema = new Schema({
  commentIds: { type: [String], default: [] },
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
});

const UserComment = mongoose.model<IUserComment>(
  "UserComment",
  UserCommentSchema
);
export default UserComment;

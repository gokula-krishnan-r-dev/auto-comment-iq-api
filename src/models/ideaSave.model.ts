import mongoose, { Schema, Document, Types } from "mongoose";

interface Idea extends Document {
  userId: Types.ObjectId;
  ideaId: Types.ObjectId;
  isYouTuber: boolean;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ideaSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Reference to User model
    ideaId: { type: Schema.Types.ObjectId, ref: "Idea", required: true },
    isYouTuber: { type: Boolean, default: false },
    isAccepted: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model<Idea>("idea-bookmark", ideaSchema);

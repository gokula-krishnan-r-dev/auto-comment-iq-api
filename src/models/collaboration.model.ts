import mongoose, { Schema, Document, Types } from "mongoose";

interface Collaboration {
  title: string;
  message: string;
  channel: boolean;
  channel_id: string;
  channel_name: string;
  channel_logo: string;
  user: Types.ObjectId | any;
  userId: Types.ObjectId | any;
  isReviewed: boolean;
  isViewed: boolean;
  isAccepted: boolean;
  isRejected: boolean;
}

interface CollaborationDocument extends Collaboration, Document {
  createdAt: Date;
  updatedAt: Date;
}

const collaborationSchema = new Schema<CollaborationDocument>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    channel: { type: Boolean, default: false },
    channel_id: { type: String },
    channel_name: { type: String },
    channel_logo: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "users" }, // Assuming a User model
    userId: { type: Schema.Types.ObjectId }, // Assuming a User model
    isReviewed: { type: Boolean, default: false },
    isViewed: { type: Boolean, default: false },
    isAccepted: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CollaborationModel = mongoose.model<CollaborationDocument>(
  "collaborations",
  collaborationSchema
);

export default CollaborationModel;

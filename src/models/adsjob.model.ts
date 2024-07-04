import { Schema, model, Document, Types } from "mongoose";

export interface IJobAd extends Document {
  title?: string;
  type: string;
  description?: string;
  companyName?: string;
  location?: string;
  pricePerVideo?: number;
  level?: string;
  city?: "chennai" | "Mumbai";
  requirements?: string;
  userId: Types.ObjectId;
  user: Types.ObjectId;
  category?: string;
  contact_number?: string;
  is18plus?: boolean;
  isKids?: boolean;
  createdAt: Date;
}

const jobAdSchema = new Schema<IJobAd>({
  title: String,
  description: String,
  companyName: String,
  type: String,
  location: String,
  pricePerVideo: Number,
  city: {
    type: String,
    enum: ["chennai", "tamil nadu"],
  },
  requirements: String,
  level: String,
  contact_number: String,
  isKids: { type: Boolean, default: false },
  category: String,
  is18plus: { type: Boolean, default: false },
  userId: {
    type: Schema.Types.ObjectId,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const JobAd = model<IJobAd>("job_ads", jobAdSchema);

export default JobAd;

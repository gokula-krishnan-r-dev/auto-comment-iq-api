import mongoose, { Schema, Document } from "mongoose";

interface Lead {
  name: string;
  avatar: string;
}

export interface Idea extends Document {
  name: string;
  status: string;
  prediction: string;
  lead?: Lead;
  userId?: string;
}

const ideaSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
    prediction: { type: String, required: true },
    lead: {
      name: { type: String },
      avatar: { type: String },
    },
    userId: { type: String },
  },

  {
    timestamps: true,
  }
);

// Define and export model
export default mongoose.model<Idea>("Idea", ideaSchema);

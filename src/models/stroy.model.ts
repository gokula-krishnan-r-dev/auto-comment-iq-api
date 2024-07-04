import mongoose, { Document, Schema, Model, model, Types } from "mongoose";

interface IStory extends Document {
  url: string;
  type: string;
  roomId: Types.ObjectId | string;
  user: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  ads_link?: string;
  ads_image?: string;
  ads_title?: string;
  ads_description?: string;
  ads_price?: string;
  ads_location?: string;
  ads_contact?: string;
  ads_category?: string;
  active_ads?: boolean;
  ads_id?: string;
  ads_company?: string;
  ads_email?: string;
}

const storySchema: Schema<IStory> = new Schema<IStory>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  roomId: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  ads_link: String,
  ads_image: String,
  ads_title: String,
  ads_description: String,
  ads_price: String,
  ads_location: String,
  ads_contact: String,
  ads_category: String,
  active_ads: Boolean,
  ads_id: String,
  ads_company: String,
  ads_email: String,
});

// Create a Mongoose model for the 'stories' collection
const StoryModel: Model<IStory> = model<IStory>("Story", storySchema);

export default StoryModel;

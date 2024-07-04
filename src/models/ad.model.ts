import mongoose, { Document, Schema, Types } from "mongoose";

interface AdModel extends Document {
  title: string;
  description: string;
  url: string;
  ads_company_name: string;
  ads_company_website: string;
  ads_company_email: string;
  ads_company_phone: string;
  ads_company_address: string;
  ads_company_country: string;
  ads_company_logo?: string;
  ads_thumbnail?: string;
  ads_placement: string;
  to_skip: number;
  roomId: any;
  room: any;
  user: Types.ObjectId | any;
  userId: Types.ObjectId | any;
  createAt: Date;
  updateAt: Date;
}

const adSchema = new Schema<AdModel>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  url: { type: String, required: true },
  ads_company_name: { type: String, required: true },
  ads_company_website: { type: String, required: true },
  ads_company_email: { type: String, required: true },
  ads_company_phone: { type: String, required: true },
  ads_company_address: { type: String, required: true },
  to_skip: { type: Number, required: false, default: 30 },
  ads_company_country: { type: String, required: true },
  ads_company_logo: { type: String, required: false },
  ads_thumbnail: { type: String, required: false },
  ads_placement: { type: String, required: false, default: "full" },
  roomId: { type: String },
  room: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "users" },
  userId: { type: Schema.Types.ObjectId },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

const Ad = mongoose.model<AdModel>("Ad", adSchema);

export default Ad;

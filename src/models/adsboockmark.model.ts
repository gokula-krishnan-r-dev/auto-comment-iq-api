import { Document, Model, Schema, Types, model } from "mongoose";

// Define bookmark interface
interface Bookmark extends Document {
  user: Types.ObjectId;
  userId: Types.ObjectId;
  bookmarks: Types.ObjectId;
}

// Define bookmark schema
const bookmarkSchema = new Schema<Bookmark>(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    bookmarks: { type: Schema.Types.ObjectId, ref: "job_ads" },
  },
  {
    timestamps: true,
  }
);

// Define bookmark model
const BookmarkModel: Model<Bookmark> = model<Bookmark>(
  "bookmarks",
  bookmarkSchema
);

export { BookmarkModel, Bookmark };

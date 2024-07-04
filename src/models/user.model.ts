// user.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  profile: any; // Update with the appropriate type
  token: string | null; // Add a field for the token
  channelId: string;
}

const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true },
  username: { type: String },
  email: { type: String, required: true },
  accessToken: { type: String },
  refreshToken: { type: Object },
  profile: { type: Schema.Types.Mixed }, // Adjust as per the profile structure
  token: { type: String, default: null },
  channelId: { type: String },
});

export default mongoose.model<IUser>("users", UserSchema);

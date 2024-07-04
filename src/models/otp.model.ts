import mongoose, { Types } from "mongoose";

interface IOtp {
  userId: Types.ObjectId;
  otp: string;
  user: Types.ObjectId;
  email?: string;
}

const OtpSchema = new mongoose.Schema<IOtp>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
    },
  },

  { timestamps: true }
);

const Otp = mongoose.model<IOtp>("Otp", OtpSchema);
export default Otp;

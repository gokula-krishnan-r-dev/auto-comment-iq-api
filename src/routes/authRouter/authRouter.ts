import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import User, { IUser } from "./../../models/user.model";
import { verifyToken } from "../../utils/verifyToken";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import mongoose from "mongoose";
import { transporter } from "../../../nodemailer";
import userModel from "./../../models/user.model";
import Otp from "../../models/otp.model";
const authRouter = express.Router();
const JWT_SECRET = "AutoCommentIQ";
authRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find({}); // Fetching only specific fields
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

authRouter.get("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // Check if the user ID is valid
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find the user by ID
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

authRouter.delete(
  "/users/:userId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      // Check if the user ID is valid
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Find the user by ID and remove it
      const deletedUser = await User.findByIdAndDelete({ _id: userId });

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
);
authRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "You are not logged in" });
});

authRouter.get("/failed", (req: Request, res: Response) => {
  res.send("Failed");
});

authRouter.get("/success", (req: any, res: Response) => {
  if (req.user && req.user.email) {
    res.send(`Welcome ${req.user.email}`);
  } else {
    res.send("Welcome");
  }
});

// authRouter.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//   })
// );
authRouter.get("/google", passport.authenticate("google"), (req, res) =>
  res.send(200)
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: any, res) => {
    // Set cookie and redirect to the client-side page

    // Calculate the expiration time for the cookies (e.g., 1 day in milliseconds)
    const oneDayInMilliseconds = 24 * 60 * 60 * 178887000; // 1 day
    const expirationDate = new Date(Date.now() + oneDayInMilliseconds);

    // Set cookies with expiry and domain
    res.cookie("accessToken", req.user.accessToken, {
      httpOnly: false,
      expires: expirationDate,
    });
    res.cookie("authToken", req.user.token, {
      httpOnly: false,
      expires: expirationDate,
    });
    res.cookie("refreshToken", req.user.refreshToken, {
      httpOnly: false,
      expires: expirationDate,
    });
    res.cookie("channelId", req.user.channelId, {
      httpOnly: false,
      expires: expirationDate,
    });
    res.cookie("_YId", req.user._id, {
      httpOnly: false,
      expires: expirationDate,
    });

    res.redirect("https://autocomment-two.vercel.app/dashboard"); // Replace with your client-side URL
  }
);

authRouter.get("/logout", function (req: any, res, next: any) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
function generateOTP(length) {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < length; i++) {
    OTP += digits[crypto.randomInt(0, digits.length)];
  }
  return OTP;
}
authRouter.post("/connect/watchos", async (req: Request, res: Response) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = jwt.verify(token, JWT_SECRET);
    const userId = accessToken.userId;
    const otp = generateOTP(6);
    res.json({ message: "You are connected to Watch OS", userId, otp });
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const emailid = user.email;
    const saveOtp = new Otp({
      userId,
      otp,
      email: emailid,
      user: userId,
    });
    await saveOtp.save();

    const mailOptions = {
      from: '"YourAppName" <your-email@example.com>',
      to: emailid, // User's email, fetched from DB
      subject: "Your One-Time Password (OTP)",
      text: `Your OTP is: ${otp}\n\nPlease enter this code on your Watch OS device to proceed. Remember, this OTP is only valid for one use and will expire shortly.`,
      html: `
        <html>
          <body>
            <h1>Your One-Time Password (OTP)</h1>
            <p>Hello,</p>
            <p>Your OTP for accessing the Watch OS application is:</p>
            <div style="font-size: 18px; font-weight: bold; margin: 10px 0;">${otp}</div>
            <p>Please enter this code on your Watch OS device to authenticate. <strong>This OTP is valid for one use only and will expire shortly.</strong></p>
            <p>If you did not request this code, please ignore this email or contact support.</p>
            <footer>
              <p>Thank you,<br/>YourAppName Team</p>
            </footer>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("Error sending mail:", error);
      }
      console.log("Mail sent:", info.response);
      res.json({ message: "OTP sent to your email", userId });
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

authRouter.post("/verify/otp", async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const saveOtp = await Otp.findOne({ otp });

    if (!saveOtp) {
      return res.status(404).json({ message: "OTP not found" });
    }

    const userId = saveOtp.userId;
    const SavedOtpT = saveOtp.otp;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (otp === SavedOtpT) {
      const completedOtp = await Otp.findOneAndDelete({
        otp: otp,
      });

      // If, for some reason, the document could not be found or already deleted
      if (!completedOtp) {
        return res
          .status(404)
          .json({ message: "OTP not found or was already used" });
      }
      return res.json({
        message: "OTP verified successfully",
        userId,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        channelId: user.channelId,
        token: user.token,
      });
    }

    return res.status(400).json({ message: "Invalid OTP" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
});

export default authRouter;

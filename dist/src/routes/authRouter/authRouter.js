"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const user_model_1 = __importDefault(require("./../../models/user.model"));
const verifyToken_1 = require("../../utils/verifyToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
const nodemailer_1 = require("../../../nodemailer");
const user_model_2 = __importDefault(require("./../../models/user.model"));
const otp_model_1 = __importDefault(require("../../models/otp.model"));
const authRouter = express_1.default.Router();
const JWT_SECRET = "AutoCommentIQ";
authRouter.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find({}); // Fetching only specific fields
        res.json(users);
    }
    catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
}));
authRouter.get("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        // Check if the user ID is valid
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        // Find the user by ID
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
}));
authRouter.delete("/users/:userId", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        // Check if the user ID is valid
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        // Find the user by ID and remove it
        const deletedUser = yield user_model_1.default.findByIdAndDelete({ _id: userId });
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully", deletedUser });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
}));
authRouter.get("/", (req, res) => {
    res.json({ message: "You are not logged in" });
});
authRouter.get("/failed", (req, res) => {
    res.send("Failed");
});
authRouter.get("/success", (req, res) => {
    if (req.user && req.user.email) {
        res.send(`Welcome ${req.user.email}`);
    }
    else {
        res.send("Welcome");
    }
});
// authRouter.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//   })
// );
authRouter.get("/google", passport_1.default.authenticate("google"), (req, res) => res.send(200));
authRouter.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => {
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
    res.redirect("http://localhost:8080/dashboard"); // Replace with your client-side URL
});
authRouter.get("/logout", function (req, res, next) {
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
        OTP += digits[crypto_1.default.randomInt(0, digits.length)];
    }
    return OTP;
}
authRouter.post("/connect/watchos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = header.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const accessToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = accessToken.userId;
        const otp = generateOTP(6);
        res.json({ message: "You are connected to Watch OS", userId, otp });
        const user = yield user_model_2.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const emailid = user.email;
        const saveOtp = new otp_model_1.default({
            userId,
            otp,
            email: emailid,
            user: userId,
        });
        yield saveOtp.save();
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
        nodemailer_1.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error("Error sending mail:", error);
            }
            console.log("Mail sent:", info.response);
            res.json({ message: "OTP sent to your email", userId });
        });
    }
    catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
}));
authRouter.post("/verify/otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const saveOtp = yield otp_model_1.default.findOne({ otp });
        if (!saveOtp) {
            return res.status(404).json({ message: "OTP not found" });
        }
        const userId = saveOtp.userId;
        const SavedOtpT = saveOtp.otp;
        const user = yield user_model_2.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (otp === SavedOtpT) {
            const completedOtp = yield otp_model_1.default.findOneAndDelete({
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
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Failed to verify OTP" });
    }
}));
exports.default = authRouter;
//# sourceMappingURL=authRouter.js.map
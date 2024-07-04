"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// import axios from "axios";
const axios = require("axios");
const dev_1 = require("../../config/dev");
const user_model_1 = __importDefault(require("./../../models/user.model"));
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "AutoCommentIQ";
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(
  new GoogleStrategy(
    {
      clientID: dev_1.GOOGLE_CLIENT_ID,
      clientSecret: dev_1.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://autocommentapi.vercel.app/auth/google/callback",
      scope: [
        "email",
        "profile",
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.force-ssl",
        "https://www.googleapis.com/auth/youtube.readonly",
      ],
    },
    (accessToken, refreshToken, profile, done) =>
      __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        console.log(accessToken);
        try {
          let user = yield user_model_1.default.findOne({
            googleId:
              profile === null || profile === void 0 ? void 0 : profile.id,
          });
          const response = yield fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${accessToken}`
          );
          // Use await to resolve the promise and get the JSON response
          const res = yield response.json();
          const channelId =
            ((_b =
              (_a = res === null || res === void 0 ? void 0 : res.items) ===
                null || _a === void 0
                ? void 0
                : _a[0]) === null || _b === void 0
              ? void 0
              : _b.id) || "no channel id";
          if (!user) {
            // Create a new user if not found
            user = new user_model_1.default({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.email,
              accessToken,
              refreshToken,
              profile,
              token: "", // Initialize token field
              channelId: channelId,
            });
            yield user.save();
          } else {
            // If the user exists, update all details
            user.username = profile.displayName;
            user.email = profile.email;
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            user.profile = profile;
            yield user.save();
          }
          // Generate JWT token
          const token = jsonwebtoken_1.default.sign(
            { userId: user.id },
            JWT_SECRET,
            {
              expiresIn: "7d",
            }
          );
          user.token = token;
          yield user.save();
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      })
  )
);
//# sourceMappingURL=passport.js.map

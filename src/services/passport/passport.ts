// import axios from "axios";
const axios = require("axios");
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../config/dev";
import User, { IUser } from "./../../models/user.model";
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
import jwt from "jsonwebtoken";
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
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://autocommentapi.vercel.app/auth/google/callback",
      scope: [
        "email",
        "profile",
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.force-ssl",
        "https://www.googleapis.com/auth/youtube.readonly",
      ],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      console.log(accessToken);

      try {
        let user = await User.findOne({ googleId: profile?.id });
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${accessToken}`
        );

        // Use await to resolve the promise and get the JSON response
        const res = await response.json();
        const channelId = res?.items?.[0]?.id || "no channel id";

        if (!user) {
          // Create a new user if not found
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.email,
            accessToken,
            refreshToken,
            profile,
            token: "", // Initialize token field
            channelId: channelId,
          });

          await user.save();
        } else {
          // If the user exists, update all details
          user.username = profile.displayName;
          user.email = profile.email;
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          user.profile = profile;

          await user.save();
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        user.token = token;
        await user.save();

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

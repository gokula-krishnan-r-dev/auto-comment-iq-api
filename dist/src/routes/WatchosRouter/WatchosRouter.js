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
const axios_1 = __importDefault(require("axios"));
const dev_1 = require("../../config/dev");
const Room_1 = __importDefault(require("../../websocket/models/Room"));
const express = require("express");
const WatchosRouter = express.Router();
WatchosRouter.get("/", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      res.json({
        message: "Welcome to Watch OS API! 🚀",
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);
WatchosRouter.get("/video", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const videoId = req.query.videoId;
      const queryParams = {
        order: "date",
        part: "snippet",
        channelId: "UCX6OQ3DkcsbYNE6H8uQQuVA", // You can make this dynamic as well if needed
        key: "AIzaSyDorh9K7BwVjy2FvRiKG0acb6puGcXqb3I", // Replace with your actual API key
        maxResults: 100,
      };
      // Construct the URL with dynamic query parameters
      const url = `https://autocommentapi.vercel.app/v1/search?${new URLSearchParams(
        queryParams
      )}`;
      const response = yield axios_1.default.get(url); // Make the axios request
      const responseData = response.data; // Extract data from the response
      // Extract relevant information from the response
      const simplifiedData = responseData.data.items.map((item) => ({
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        publishTime: item.snippet.publishTime,
        description: item.snippet.description,
        totalResults: responseData.data.pageInfo.totalResults,
        videoId: item.id.videoId,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
      }));
      res.json({
        nextPageToken: responseData.data.nextPageToken, // Send the nextPageToken in the response
        videos: simplifiedData, // Send simplified data in the response
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);
WatchosRouter.post("/comment-video", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      console.log(req.body, "body");
      const parentId = req.body.parentId;
      const textOriginal = req.body.textOriginal;
      const data = {
        snippet: {
          textOriginal: textOriginal,
          parentId: parentId,
        },
      };
      // const accessToken: string =
      //   "ya29.a0Ad52N3-oCZqgqQoBJcOA-_oYc_GsZhzPSHlxuCsnNOlKHsH8Vf5z1D19mWYO3jBKHGyq02nWhPE5HT0xs4LOAzR0C2WIqiDOaqTZBLbRXuYWSrjoQ1eoiTlrJ889ONIAMwSjpsxGsIY1EaRlEKTR7JcAj7o_XNoGMVwaCgYKAVESARASFQHGX2MilrJk4F2peXeMyR3MuRZ1ZA0170";
      const access_token = req.headers.authorization.split(" ")[1];
      console.log(access_token);
      const response = yield fetch(
        `https://youtube.googleapis.com/youtube/v3/comments?part=snippet,id`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = yield response.json();
      console.log(result, "result");
      res.json(result);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);
WatchosRouter.get("/broadcasts", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const queryParams = new URLSearchParams(req.query);
      const accessToken = req.headers.authorization.split(" ")[1];
      if (Object.keys(req.query).length === 0) {
        return res
          .status(400)
          .json({ message: "No query parameters provided" });
      }
      const response = yield axios_1.default.get(
        `https://www.googleapis.com/youtube/v3/liveBroadcasts?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const formateddata = response.data.items.map((item) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url,
        scheduledStartTime: item.snippet.scheduledStartTime,
        status: item.status,
        contentDetails: item.contentDetails,
        liveChatId: item.snippet.liveChatId,
      }));
      res.status(200).send(formateddata);
    } catch (error) {
      console.log(error.response.data.error);
      res.status(500).send("Internal Server Error");
    }
  })
);
WatchosRouter.get("/live-chat", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const liveChatId = req.query.liveChatId;
      const response = yield axios_1.default.get(
        `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&maxResults=200&key=${dev_1.apiKey}`
      );
      const formateddata = response.data.items.map((item) => ({
        id: item.id,
        authorDetails: item.authorDetails,
        snippet: item.snippet,
        nextPageToken: response.data.nextPageToken,
      }));
      res.status(200).send(formateddata);
    } catch (error) {
      console.log(error.response.data.error);
      res.status(500).send("Internal Server Error");
    }
  })
);
WatchosRouter.get("/live-chat-room/:channelId", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { channelId } = req.params;
      const room = yield Room_1.default.find({ channel_id: channelId }); // Using findOne instead of find
      if (room) {
        res.status(200).json({
          room,
        });
      } else {
        res.status(404).send("Room not found");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  })
);
exports.default = WatchosRouter;
//# sourceMappingURL=WatchosRouter.js.map

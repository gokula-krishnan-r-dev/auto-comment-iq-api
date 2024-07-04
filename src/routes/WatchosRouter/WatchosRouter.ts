import axios from "axios";
import { apiKey } from "../../config/dev";
import Room from "../../websocket/models/Room";

const express = require("express");
const WatchosRouter = express.Router();

WatchosRouter.get("/", async (req, res) => {
  try {
    res.json({
      message: "Welcome to Watch OS API! 🚀",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

WatchosRouter.get("/video", async (req, res) => {
  try {
    const videoId = req.query.videoId as string;

    const queryParams: any = {
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

    const response: any = await axios.get(url); // Make the axios request
    const responseData: any = response.data; // Extract data from the response
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
});

WatchosRouter.post("/comment-video", async (req, res) => {
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

    const response = await fetch(
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

    const result = await response.json();
    console.log(result, "result");
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

WatchosRouter.get("/broadcasts", async (req, res) => {
  try {
    const queryParams = new URLSearchParams(
      req.query as Record<string, string>
    );
    const accessToken = req.headers.authorization.split(" ")[1];
    if (Object.keys(req.query).length === 0) {
      return res.status(400).json({ message: "No query parameters provided" });
    }
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const formateddata = response.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      scheduledStartTime: item.snippet.scheduledStartTime,
      status: item.status,
      contentDetails: item.contentDetails,
      liveChatId: item.snippet.liveChatId,
    })) as any[];
    res.status(200).send(formateddata);
  } catch (error) {
    console.log(error.response.data.error);
    res.status(500).send("Internal Server Error");
  }
});

WatchosRouter.get("/live-chat", async (req, res) => {
  try {
    const liveChatId = req.query.liveChatId as string;
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&maxResults=200&key=${apiKey}`
    );
    const formateddata = response.data.items.map((item: any) => ({
      id: item.id,
      authorDetails: item.authorDetails,
      snippet: item.snippet,
      nextPageToken: response.data.nextPageToken,
    })) as any[];
    res.status(200).send(formateddata);
  } catch (error) {
    console.log(error.response.data.error);
    res.status(500).send("Internal Server Error");
  }
});

WatchosRouter.get("/live-chat-room/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const room = await Room.find({ channel_id: channelId }); // Using findOne instead of find
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
});

export default WatchosRouter;

import axios from "axios";

const express = require("express");
const LiveStreamRouter = express.Router();

LiveStreamRouter.get("/chat", async (req, res) => {
  try {
    const queryParams = new URLSearchParams(
      req.query as Record<string, string>
    );

    if (Object.keys(req.query).length === 0) {
      return res.status(400).json({ message: "No query parameters provided" });
    }
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/liveChat/messages?${queryParams.toString()}`
    );

    res.status(200).send(response.data);
  } catch (error) {
    console.log(error.response.data.error);
    res.status(500).send("Internal Server Error");
  }
});

LiveStreamRouter.get("/broadcasts", async (req, res) => {
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

    res.status(200).send(response.data);
  } catch (error) {
    console.log(error?.response?.data?.error);
    res.status(500).send("Internal Server Error");
  }
});

LiveStreamRouter.post("/chat", async (req, res) => {
  try {
    const { liveChatId, message } = req.body;
    const accessToken = req.headers.authorization.split(" ")[1];
    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet`,
      {
        snippet: {
          liveChatId,
          type: "textMessageEvent",
          textMessageDetails: {
            messageText: message,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("watch os chat response", response.data);

    res.status(200).send(response.data);
  } catch (error) {
    console.log(error.response.data.error);
    res.status(500).send("Internal Server Error");
  }
});

export default LiveStreamRouter;

import Room from "../websocket/models/Room";
import RouterApp from "./route";

const express = require("express");
const RoomRoute = express.Router();
// const Room = require("../../src/websocket/models/Room"); // Import your Room model

RoomRoute.get("/rooms", async (req, res) => {
  try {
    // Your logic here
    const rooms = await Room.find({}).populate("user"); // Add 'await' to execute the query

    res.status(200).json({ rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

RoomRoute.get("/room/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId }).populate("user");
    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

RoomRoute.post("/create-room", async (req, res) => {
  try {
    // Validate request body
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Bad Request. Request body is missing." });
    }

    const {
      name,
      roomId,
      userId,
      authorId,
      videoId,
      user,
      channel_name,
      channel_id,
      video_title,
      channel_logo,
      video_thumbnail,
    } = req.body;

    // Check if roomId already exists
    const existingRoom = await Room.findOne({ roomId });

    if (existingRoom) {
      // Room with the same roomId already exists
      return res.status(200).json({
        error: "Duplicate key error. Room with the same roomId already exists.",
        success: false,
        code: 200,
      });
    }

    // Create a new room instance
    const room = new Room({
      name,
      roomId,
      userId,
      authorId,
      videoId,
      user,
      channel_name,
      channel_id,
      video_title,
      channel_logo,
      video_thumbnail,
    });

    // Save the room to the database
    await room.save();

    // Send a success response
    res.status(201).json({
      message: "Room Created",
      room,
      success: true,
      error: false,
      code: 201,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Duplicate key error. Room already exists." });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default RoomRoute;

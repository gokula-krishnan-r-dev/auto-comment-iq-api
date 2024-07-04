import { Request, Response } from "express";
import onlineUser from "../models/online.model";

const express = require("express");
const onlineRouter = express.Router();

onlineRouter.get("/", (req, res) => {
  try {
    const online = onlineUser.find();
    res.send(online);
  } catch (error) {
    res.status(500).send(error);
  }
});

onlineRouter.post("/", async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    // Check if an online user with the specified roomId already exists
    const existingOnlineUser = await onlineUser.findOne({ roomId });

    if (existingOnlineUser) {
      // If an online user with the roomId already exists, send a response indicating it
      return res.status(409).send("User is already online in this room");
    }

    // If no online user with the roomId exists, create a new one
    const online = new onlineUser({ roomId, userId });
    await online.save();
    res.status(201).send(online); // 201 status code for successful creation
  } catch (error) {
    console.error("Error creating online user:", error);
    res.status(500).send("Internal Server Error");
  }
});

onlineRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id;

    // Find the online user by userId
    const existingOnlineUser = await onlineUser
      .findOne({ roomId })
      .populate("user");

    if (!existingOnlineUser) {
      // If no online user is found with the provided userId, return a 404 response
      return res.status(404).json({ message: "Online user not found" });
    }

    // If an online user is found, return it
    res.status(200).json(existingOnlineUser);
  } catch (error) {
    console.error("Error finding online user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default onlineRouter;

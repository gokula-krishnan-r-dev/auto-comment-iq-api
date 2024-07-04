import pinModel from "../../models/pin.model";
import PollModel from "../../models/poll.model";
import userModel from "../../models/user.model";

const express = require("express");
const PinCommentRouter = express.Router();

PinCommentRouter.get("/pin", async (req, res) => {
  try {
    const pinComments = await pinModel.find({});
    res.json(pinComments);
  } catch (error) {
    console.error("Error retrieving pin comments:", error);
    res.status(500).json({ message: "Failed to fetch pin comments" });
  }
});

PinCommentRouter.get("/pin/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;

    // Find the pins by room ID and populate the referenced documents
    const pinComments = await pinModel
      .find({ room: roomId })
      .populate("userId messageId roomId");

    if (!pinComments) {
      return res.status(404).json({ message: "Pin comments not found" });
    }

    // Fetch associated polls for each pin
    const populatedPins = await Promise.all(
      pinComments.map(async (pin) => {
        if (pin.pinType === "poll" && pin.messageId && pin.messageId.pollId) {
          const pollId = pin.messageId.pollId;
          const poll = await PollModel.findById(pollId);
          if (poll) {
            // Fetch user details associated with the poll
            const user = await userModel.findById(poll.userId);
            // Embed user details inside the poll object
            const pollWithUser = { ...poll.toObject(), user };
            return { ...pin.toObject(), poll: pollWithUser };
          }
        }
        // Fetch user details associated with the pin
        const user = await userModel.findById(pin.userId);
        return { ...pin.toObject(), user };
      })
    );

    res.json(populatedPins);
  } catch (error) {
    console.error("Error fetching pin comments:", error);
    res.status(500).json({ message: "Failed to fetch pin comments" });
  }
});

PinCommentRouter.post("/pin", async (req, res) => {
  try {
    const pinComment = new pinModel(req.body);
    const savedPinComment = await pinComment.save();
    res.json(savedPinComment);
  } catch (error) {
    console.error("Error saving pin comment:", error);
    res.status(500).json({ message: "Failed to save pin comment" });
  }
});

export default PinCommentRouter;

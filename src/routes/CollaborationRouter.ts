import { Request, Response } from "express";
import CollaborationModel from "../models/collaboration.model";

const express = require("express");
const CollaborationRouter = express.Router();

CollaborationRouter.post("/", async (req, res) => {
  try {
    const collaboration = new CollaborationModel(req.body);
    await collaboration.save();
    res.status(201).json({
      message: "CollaborationRouter is working",
    });
  } catch (error) {
    res.status(500).json({
      message: "CollaborationRouter is not working",
    });
  }
});

CollaborationRouter.get("/", async (req, res) => {
  try {
    const collaborations = await CollaborationModel.find();
    res.status(200).json(collaborations);
  } catch (error) {
    res.status(500).json({
      message: "CollaborationRouter is not working",
    });
  }
});

CollaborationRouter.get("/:id", async (req, res) => {
  try {
    const collaboration = await CollaborationModel.findById(req.params.id);
    res.status(200).json(collaboration);
  } catch (error) {
    res.status(500).json({
      message: "CollaborationRouter is not working",
    });
  }
});

CollaborationRouter.put("/", async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { collaborationId, isReviewed, isViewed, isAccepted, isRejected } =
      req.body;
    if (!collaborationId) {
      return res.status(400).json({ message: "Collaboration ID is required." });
    }

    if (
      typeof isReviewed !== "boolean" ||
      typeof isViewed !== "boolean" ||
      typeof isAccepted !== "boolean" ||
      typeof isRejected !== "boolean"
    ) {
      return res.status(400).json({ message: "Invalid data format." });
    }

    // Find collaboration by ID and update user-related attributes
    const collaboration = await CollaborationModel.findByIdAndUpdate(
      collaborationId,
      { isReviewed, isViewed, isAccepted, isRejected },
      { new: true }
    );

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration not found." });
    }

    res
      .status(200)
      .json({ message: "Collaboration updated successfully.", collaboration });
  } catch (error) {
    console.error("Error updating collaboration:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the collaboration." });
  }
});

CollaborationRouter.delete("/:id", async (req, res) => {
  try {
    await CollaborationModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "CollaborationRouter is working",
    });
  } catch (error) {
    res.status(500).json({
      message: "CollaborationRouter is not working",
    });
  }
});

export default CollaborationRouter;

import { Request, Response } from "express";
import JobAd from "../../models/adsjob.model";
import { BookmarkModel } from "../../models/adsboockmark.model";

const express = require("express");
const JobAdsRouter = express();

JobAdsRouter.post("/", async (req, res) => {
  try {
    const newJobAdData = req.body;

    // Additional validation for required fields
    if (!newJobAdData.title || !newJobAdData.description) {
      return res.status(400).json({
        error: "Title, description, and companyName are required fields.",
      });
    }

    const newJobAd = new JobAd(newJobAdData);
    const savedJobAd = await newJobAd.save();
    res.status(201).json({
      result: savedJobAd,
      message: "Job ad created successfully",
      status: "success",
      code: 201,
    });
  } catch (error) {
    console.error("Error creating job ad:", error);

    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      return res
        .status(400)
        .json({ error: "Validation error", details: error.errors });
    }

    // Handle other unexpected errors
    res.status(500).json({ error: "Internal Server Error" });
  }
});

JobAdsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      const jobAds = await JobAd.find().populate("user");
      return res.json(jobAds);
    }

    const query: any = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { companyName: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    };

    const jobAds = await JobAd.find(query);
    res.json(jobAds);
  } catch (error) {
    console.error("Error searching job ads:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

JobAdsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const jobAd = await JobAd.findById(req.params.id);
    if (jobAd) {
      res.json(jobAd);
    } else {
      res.status(404).json({ error: "JobAd not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

JobAdsRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      const jobAds = await JobAd.find().populate("user");
      return res.json(jobAds);
    }

    const query: any = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { companyName: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    };

    const jobAds = await JobAd.find(query);
    res.json(jobAds);
  } catch (error) {
    console.error("Error searching job ads:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

JobAdsRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedJobAd = await JobAd.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedJobAd) {
      res.json(updatedJobAd);
    } else {
      res.status(404).json({ error: "JobAd not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

JobAdsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedJobAd = await JobAd.findByIdAndDelete(req.params.id);
    if (deletedJobAd) {
      res.json(deletedJobAd);
    } else {
      res.status(404).json({ error: "JobAd not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

JobAdsRouter.post("/bookmarks", async (req: Request, res: Response) => {
  try {
    const { user, userId, bookmarks } = req.body;

    // Check if a bookmark with the same ID already exists
    const existingBookmark = await BookmarkModel.findOne({ bookmarks });
    if (existingBookmark) {
      // Delete the existing bookmark
      await BookmarkModel.findByIdAndDelete(existingBookmark._id);
      res.status(200).json({
        code: 200,
        message: "Bookmark deleted successfully",
        status: "success",
      });
      return;
    }

    // Create the new bookmark
    const newBookmark = await BookmarkModel.create({
      user,
      userId,
      bookmarks: bookmarks,
    });

    res.status(201).json({
      newBookmark,
      code: 201,
      message: "Bookmark created successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET API to get all bookmarks
JobAdsRouter.get("/bookmarks", async (req: Request, res: Response) => {
  try {
    const bookmarks = await BookmarkModel.find();
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET API to get bookmarks by user ID
JobAdsRouter.get("/bookmarks/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const bookmarks = await BookmarkModel.find({ userId })
      .populate("user")
      .populate("bookmarks");

    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default JobAdsRouter;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adsjob_model_1 = __importDefault(require("../../models/adsjob.model"));
const adsboockmark_model_1 = require("../../models/adsboockmark.model");
const express = require("express");
const JobAdsRouter = express();
JobAdsRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newJobAdData = req.body;
        // Additional validation for required fields
        if (!newJobAdData.title || !newJobAdData.description) {
            return res.status(400).json({
                error: "Title, description, and companyName are required fields.",
            });
        }
        const newJobAd = new adsjob_model_1.default(newJobAdData);
        const savedJobAd = yield newJobAd.save();
        res.status(201).json({
            result: savedJobAd,
            message: "Job ad created successfully",
            status: "success",
            code: 201,
        });
    }
    catch (error) {
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
}));
JobAdsRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q } = req.query;
        if (!q || typeof q !== "string") {
            const jobAds = yield adsjob_model_1.default.find().populate("user");
            return res.json(jobAds);
        }
        const query = {
            $or: [
                { title: { $regex: q, $options: "i" } },
                { companyName: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } },
            ],
        };
        const jobAds = yield adsjob_model_1.default.find(query);
        res.json(jobAds);
    }
    catch (error) {
        console.error("Error searching job ads:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
JobAdsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobAd = yield adsjob_model_1.default.findById(req.params.id);
        if (jobAd) {
            res.json(jobAd);
        }
        else {
            res.status(404).json({ error: "JobAd not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
JobAdsRouter.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q } = req.query;
        if (!q || typeof q !== "string") {
            const jobAds = yield adsjob_model_1.default.find().populate("user");
            return res.json(jobAds);
        }
        const query = {
            $or: [
                { title: { $regex: q, $options: "i" } },
                { companyName: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } },
            ],
        };
        const jobAds = yield adsjob_model_1.default.find(query);
        res.json(jobAds);
    }
    catch (error) {
        console.error("Error searching job ads:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
JobAdsRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedJobAd = yield adsjob_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedJobAd) {
            res.json(updatedJobAd);
        }
        else {
            res.status(404).json({ error: "JobAd not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
JobAdsRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedJobAd = yield adsjob_model_1.default.findByIdAndDelete(req.params.id);
        if (deletedJobAd) {
            res.json(deletedJobAd);
        }
        else {
            res.status(404).json({ error: "JobAd not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
JobAdsRouter.post("/bookmarks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, userId, bookmarks } = req.body;
        // Check if a bookmark with the same ID already exists
        const existingBookmark = yield adsboockmark_model_1.BookmarkModel.findOne({ bookmarks });
        if (existingBookmark) {
            // Delete the existing bookmark
            yield adsboockmark_model_1.BookmarkModel.findByIdAndDelete(existingBookmark._id);
            res.status(200).json({
                code: 200,
                message: "Bookmark deleted successfully",
                status: "success",
            });
            return;
        }
        // Create the new bookmark
        const newBookmark = yield adsboockmark_model_1.BookmarkModel.create({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// GET API to get all bookmarks
JobAdsRouter.get("/bookmarks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookmarks = yield adsboockmark_model_1.BookmarkModel.find();
        res.status(200).json(bookmarks);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// GET API to get bookmarks by user ID
JobAdsRouter.get("/bookmarks/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const bookmarks = yield adsboockmark_model_1.BookmarkModel.find({ userId })
            .populate("user")
            .populate("bookmarks");
        res.status(200).json(bookmarks);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = JobAdsRouter;
//# sourceMappingURL=JobadsRouter.js.map
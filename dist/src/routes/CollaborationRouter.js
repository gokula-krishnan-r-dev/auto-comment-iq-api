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
const collaboration_model_1 = __importDefault(require("../models/collaboration.model"));
const express = require("express");
const CollaborationRouter = express.Router();
CollaborationRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collaboration = new collaboration_model_1.default(req.body);
        yield collaboration.save();
        res.status(201).json({
            message: "CollaborationRouter is working",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "CollaborationRouter is not working",
        });
    }
}));
CollaborationRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collaborations = yield collaboration_model_1.default.find();
        res.status(200).json(collaborations);
    }
    catch (error) {
        res.status(500).json({
            message: "CollaborationRouter is not working",
        });
    }
}));
CollaborationRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collaboration = yield collaboration_model_1.default.findById(req.params.id);
        res.status(200).json(collaboration);
    }
    catch (error) {
        res.status(500).json({
            message: "CollaborationRouter is not working",
        });
    }
}));
CollaborationRouter.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const { collaborationId, isReviewed, isViewed, isAccepted, isRejected } = req.body;
        if (!collaborationId) {
            return res.status(400).json({ message: "Collaboration ID is required." });
        }
        if (typeof isReviewed !== "boolean" ||
            typeof isViewed !== "boolean" ||
            typeof isAccepted !== "boolean" ||
            typeof isRejected !== "boolean") {
            return res.status(400).json({ message: "Invalid data format." });
        }
        // Find collaboration by ID and update user-related attributes
        const collaboration = yield collaboration_model_1.default.findByIdAndUpdate(collaborationId, { isReviewed, isViewed, isAccepted, isRejected }, { new: true });
        if (!collaboration) {
            return res.status(404).json({ message: "Collaboration not found." });
        }
        res
            .status(200)
            .json({ message: "Collaboration updated successfully.", collaboration });
    }
    catch (error) {
        console.error("Error updating collaboration:", error);
        res
            .status(500)
            .json({ message: "An error occurred while updating the collaboration." });
    }
}));
CollaborationRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield collaboration_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "CollaborationRouter is working",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "CollaborationRouter is not working",
        });
    }
}));
exports.default = CollaborationRouter;
//# sourceMappingURL=CollaborationRouter.js.map
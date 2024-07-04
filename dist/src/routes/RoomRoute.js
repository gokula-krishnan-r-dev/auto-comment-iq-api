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
const Room_1 = __importDefault(require("../websocket/models/Room"));
const express = require("express");
const RoomRoute = express.Router();
// const Room = require("../../src/websocket/models/Room"); // Import your Room model
RoomRoute.get("/rooms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Your logic here
        const rooms = yield Room_1.default.find({}).populate("user"); // Add 'await' to execute the query
        res.status(200).json({ rooms });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
RoomRoute.get("/room/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        const room = yield Room_1.default.findOne({ roomId }).populate("user");
        res.status(200).json(room);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
RoomRoute.post("/create-room", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        if (!req.body) {
            return res
                .status(400)
                .json({ error: "Bad Request. Request body is missing." });
        }
        const { name, roomId, userId, authorId, videoId, user, channel_name, channel_id, video_title, channel_logo, video_thumbnail, } = req.body;
        // Check if roomId already exists
        const existingRoom = yield Room_1.default.findOne({ roomId });
        if (existingRoom) {
            // Room with the same roomId already exists
            return res.status(200).json({
                error: "Duplicate key error. Room with the same roomId already exists.",
                success: false,
                code: 200,
            });
        }
        // Create a new room instance
        const room = new Room_1.default({
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
        yield room.save();
        // Send a success response
        res.status(201).json({
            message: "Room Created",
            room,
            success: true,
            error: false,
            code: 201,
        });
    }
    catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res
                .status(400)
                .json({ error: "Duplicate key error. Room already exists." });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = RoomRoute;
//# sourceMappingURL=RoomRoute.js.map
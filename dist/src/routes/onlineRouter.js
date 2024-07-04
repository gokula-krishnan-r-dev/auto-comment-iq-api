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
const online_model_1 = __importDefault(require("../models/online.model"));
const express = require("express");
const onlineRouter = express.Router();
onlineRouter.get("/", (req, res) => {
    try {
        const online = online_model_1.default.find();
        res.send(online);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
onlineRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, userId } = req.body;
        // Check if an online user with the specified roomId already exists
        const existingOnlineUser = yield online_model_1.default.findOne({ roomId });
        if (existingOnlineUser) {
            // If an online user with the roomId already exists, send a response indicating it
            return res.status(409).send("User is already online in this room");
        }
        // If no online user with the roomId exists, create a new one
        const online = new online_model_1.default({ roomId, userId });
        yield online.save();
        res.status(201).send(online); // 201 status code for successful creation
    }
    catch (error) {
        console.error("Error creating online user:", error);
        res.status(500).send("Internal Server Error");
    }
}));
onlineRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.params.id;
        // Find the online user by userId
        const existingOnlineUser = yield online_model_1.default
            .findOne({ roomId })
            .populate("user");
        if (!existingOnlineUser) {
            // If no online user is found with the provided userId, return a 404 response
            return res.status(404).json({ message: "Online user not found" });
        }
        // If an online user is found, return it
        res.status(200).json(existingOnlineUser);
    }
    catch (error) {
        console.error("Error finding online user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = onlineRouter;
//# sourceMappingURL=onlineRouter.js.map
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
const pin_model_1 = __importDefault(require("../../models/pin.model"));
const poll_model_1 = __importDefault(require("../../models/poll.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const express = require("express");
const PinCommentRouter = express.Router();
PinCommentRouter.get("/pin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pinComments = yield pin_model_1.default.find({});
        res.json(pinComments);
    }
    catch (error) {
        console.error("Error retrieving pin comments:", error);
        res.status(500).json({ message: "Failed to fetch pin comments" });
    }
}));
PinCommentRouter.get("/pin/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.params.roomId;
        // Find the pins by room ID and populate the referenced documents
        const pinComments = yield pin_model_1.default
            .find({ room: roomId })
            .populate("userId messageId roomId");
        if (!pinComments) {
            return res.status(404).json({ message: "Pin comments not found" });
        }
        // Fetch associated polls for each pin
        const populatedPins = yield Promise.all(pinComments.map((pin) => __awaiter(void 0, void 0, void 0, function* () {
            if (pin.pinType === "poll" && pin.messageId && pin.messageId.pollId) {
                const pollId = pin.messageId.pollId;
                const poll = yield poll_model_1.default.findById(pollId);
                if (poll) {
                    // Fetch user details associated with the poll
                    const user = yield user_model_1.default.findById(poll.userId);
                    // Embed user details inside the poll object
                    const pollWithUser = Object.assign(Object.assign({}, poll.toObject()), { user });
                    return Object.assign(Object.assign({}, pin.toObject()), { poll: pollWithUser });
                }
            }
            // Fetch user details associated with the pin
            const user = yield user_model_1.default.findById(pin.userId);
            return Object.assign(Object.assign({}, pin.toObject()), { user });
        })));
        res.json(populatedPins);
    }
    catch (error) {
        console.error("Error fetching pin comments:", error);
        res.status(500).json({ message: "Failed to fetch pin comments" });
    }
}));
PinCommentRouter.post("/pin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pinComment = new pin_model_1.default(req.body);
        const savedPinComment = yield pinComment.save();
        res.json(savedPinComment);
    }
    catch (error) {
        console.error("Error saving pin comment:", error);
        res.status(500).json({ message: "Failed to save pin comment" });
    }
}));
exports.default = PinCommentRouter;
//# sourceMappingURL=PinCommentRouter.js.map
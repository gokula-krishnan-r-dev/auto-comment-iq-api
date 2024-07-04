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
const poll_model_1 = __importDefault(require("../../models/poll.model"));
const express = require("express");
const PollRouter = express.Router();
PollRouter.get("/", (req, res) => {
    res.send("PollRouter");
});
PollRouter.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const polls = yield poll_model_1.default.find();
        res.status(200).json({
            result: polls,
            message: "Polls fetched successfully",
            status: "success",
            statusCode: 200,
            success: true,
            error: false,
        });
    }
    catch (error) {
        console.error("Error fetching polls:", error);
        res.status(200).send("Internal Server Error");
    }
}));
PollRouter.post("/:pollId/vote", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pollId = req.params.pollId;
        const { option, userId, user, type } = req.body; // Assuming the option is sent in the request body
        // Find the poll by ID
        const poll = yield poll_model_1.default.findById(pollId);
        if (!poll) {
            return res.status(200).json({ message: "Poll not found" });
        }
        // // Check if the poll has the specified option
        // if (!poll.options.includes(option)) {
        //   return res.status(200).json({ message: "Invalid option" });
        // }
        // Check if the user has already voted
        const existingVote = poll.votes.find((vote) => vote.user.toString() === userId);
        if (existingVote) {
            return res
                .status(200)
                .json({ message: "You have already voted on this poll" });
        }
        // Create a new vote
        const newVote = {
            option,
            user, // Assuming you have authentication middleware that adds the user to the request
            userId,
            type,
            roomId: poll.roomId,
            updatedAt: new Date(),
            createdAt: new Date(),
        };
        // Add the vote to the poll's votes array
        poll.votes.push(newVote);
        // Save the updated poll
        yield poll.save();
        res.status(201).json({ message: "Vote added successfully", vote: newVote });
    }
    catch (error) {
        console.error(error);
        res.status(200).json({ message: "Internal Server Error" });
    }
}));
PollRouter.get("/:pollId/votes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pollId = req.params.pollId;
        // Find the poll by ID
        const poll = yield poll_model_1.default.findById(pollId);
        if (!poll) {
            return res.status(200).json({ message: "Poll not found" });
        }
        // Count votes for each option
        const optionVotes = {};
        poll.options.forEach((option) => {
            const votesForOption = poll.votes.filter((vote) => vote.option === option);
            optionVotes[option] = votesForOption.length;
        });
        res.status(200).json({ optionVotes });
    }
    catch (error) {
        console.error(error);
        res.status(200).json({ message: "Internal Server Error" });
    }
}));
PollRouter.get("/get/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        const polls = yield poll_model_1.default.find({ roomId }).populate("user");
        if (polls && polls.length > 0) {
            res.status(200).json({
                result: polls,
                message: "Polls fetched successfully",
                status: "success",
                statusCode: 200,
                success: true,
                error: false,
            });
        }
        else {
            res.status(200).json({
                result: null,
                message: "No polls found for the given roomId",
                status: "error",
                statusCode: 200,
                success: false,
                error: true,
            });
        }
    }
    catch (error) {
        console.error("Error fetching polls:", error);
        res.status(500).send("Internal Server Error");
    }
}));
PollRouter.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPoll = new poll_model_1.default(req.body);
        const savedPoll = yield newPoll.save();
        res.status(201).json({
            result: savedPoll,
            message: "Poll created successfully",
            status: "success",
            statusCode: 201,
            success: true,
            error: false,
        });
    }
    catch (error) {
        console.error("Error creating poll:", error);
        if (error.name === "ValidationError") {
            res
                .status(400)
                .json({ error: "Validation Error", details: error.message });
        }
        else {
            res.status(500).send("Internal Server Error");
        }
    }
}));
exports.default = PollRouter;
//# sourceMappingURL=PollRouter.js.map
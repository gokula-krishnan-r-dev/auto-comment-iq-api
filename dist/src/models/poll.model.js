"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VoteSchema = new mongoose_1.Schema({
    option: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "users", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId },
    type: { type: String, required: true },
    roomId: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});
const PollSchema = new mongoose_1.Schema({
    url: { type: String },
    type: { type: String, required: true },
    roomId: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "users", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    question: String,
    options: [String],
    isUrl: Boolean,
    votes: [VoteSchema], // Added the votes field
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const PollModel = (0, mongoose_1.model)("polls", PollSchema);
exports.default = PollModel;
//# sourceMappingURL=poll.model.js.map
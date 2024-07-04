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
const express_1 = require("express");
const idea_model_1 = __importDefault(require("../../models/idea.model"));
const ideaSave_model_1 = __importDefault(require("../../models/ideaSave.model"));
const DailyIdea = (0, express_1.Router)();
DailyIdea.post("/ideas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newIdeaData = req.body;
        const idea = new idea_model_1.default(newIdeaData);
        yield idea.save();
        res.status(201).json({ message: "Idea added successfully", idea });
    }
    catch (err) {
        console.error("Error adding idea:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
DailyIdea.get("/ideas/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const ideas = yield idea_model_1.default.find({ userId });
        res.status(200).json({ ideas });
    }
    catch (err) {
        console.error("Error fetching ideas:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
DailyIdea.post("/ideas/save/:ideaId/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ideaId = req.params.ideaId;
        const userId = req.params.userId;
        const { isAccepted } = req.body;
        const idea = yield ideaSave_model_1.default.findOne({ ideaId });
        if (idea) {
            idea.isAccepted = isAccepted;
            yield idea.save();
            return res.status(200).json({ message: "Idea updated successfully" });
        }
        else {
            const SaveIdea = new ideaSave_model_1.default({
                userId,
                ideaId,
                isYouTuber: false,
                isAccepted,
            });
            yield SaveIdea.save();
            res.status(201).json({ message: "Idea saved successfully", SaveIdea });
        }
    }
    catch (err) {
        console.error("Error updating idea:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
DailyIdea.get("/ideas/save/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const ideas = yield ideaSave_model_1.default
            .find({ userId })
            .populate("ideaId")
            .populate("userId");
        res.status(200).json({ ideas });
    }
    catch (err) {
        console.error("Error fetching ideas:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
DailyIdea.get("/ideas/ai/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, system } = req.query;
    const userId = req.params.userId;
    try {
        function run(model, input) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield fetch(`https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`, {
                    headers: {
                        Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
                    },
                    method: "POST",
                    body: JSON.stringify(input),
                });
                const result = yield response.json();
                return result;
            });
        }
        run("@hf/thebloke/llama-2-13b-chat-awq", {
            messages: [
                {
                    role: "system",
                    content: `You are an AI assistant and help me with content ideas for you tube give a idea title give me different title ideas for this message`,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        }).then((response) => {
            var _a, _b, _c;
            // Extract alternative title ideas from the response string
            const titlesString = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.split("\n")) === null || _c === void 0 ? void 0 : _c.filter((description) => description.trim() !== "");
            // Create a JSON-like structure for the titles
            const alternativeTitles = titlesString === null || titlesString === void 0 ? void 0 : titlesString.slice(1, 6).map((description, index) => ({
                index: index + 1,
                description: description.replace(/^\d+\.\s+/, ""),
            }));
            for (const title of alternativeTitles) {
                const idea = new idea_model_1.default({
                    name: title.description,
                    status: "completed",
                    prediction: "High",
                    userId,
                });
                idea.save();
            }
            res.status(201).json({ message: "Ideas created successfully" });
        });
    }
    catch (_a) {
        res.send("somethings Went Wrong !");
    }
}));
exports.default = DailyIdea;
//# sourceMappingURL=DailyIdeaRouter.js.map
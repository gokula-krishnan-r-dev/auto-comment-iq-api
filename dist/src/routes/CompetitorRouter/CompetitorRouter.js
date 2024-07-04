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
const competitor_model_1 = __importDefault(require("../../models/competitor.model"));
const express = require("express");
const CompetitorRouter = express.Router();
CompetitorRouter.get("/", (req, res) => {
    res.send("Hello World!");
});
CompetitorRouter.post("/save", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, channelId, channelName, channelAvatar } = req.body;
        const competitor = new competitor_model_1.default({
            userId,
            user: userId,
            channelId,
            channelName: channelName,
            channelAvatar: channelAvatar,
        });
        yield competitor.save();
        res
            .status(201)
            .json({ message: "Competitor channelId saved successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
CompetitorRouter.get("/find/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const competitors = yield competitor_model_1.default.find({ userId }).populate("user");
        res.status(200).json({ competitors });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
CompetitorRouter.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield competitor_model_1.default.findByIdAndDelete(id);
        res
            .status(200)
            .json({ message: "Competitor channelId deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = CompetitorRouter;
//# sourceMappingURL=CompetitorRouter.js.map
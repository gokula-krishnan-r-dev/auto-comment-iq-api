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
const axios_1 = __importDefault(require("axios"));
const express = require("express");
const LiveStreamRouter = express.Router();
LiveStreamRouter.get("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryParams = new URLSearchParams(req.query);
        if (Object.keys(req.query).length === 0) {
            return res.status(400).json({ message: "No query parameters provided" });
        }
        const response = yield axios_1.default.get(`https://www.googleapis.com/youtube/v3/liveChat/messages?${queryParams.toString()}`);
        res.status(200).send(response.data);
    }
    catch (error) {
        console.log(error.response.data.error);
        res.status(500).send("Internal Server Error");
    }
}));
LiveStreamRouter.get("/broadcasts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const queryParams = new URLSearchParams(req.query);
        const accessToken = req.headers.authorization.split(" ")[1];
        if (Object.keys(req.query).length === 0) {
            return res.status(400).json({ message: "No query parameters provided" });
        }
        const response = yield axios_1.default.get(`https://www.googleapis.com/youtube/v3/liveBroadcasts?${queryParams.toString()}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        res.status(200).send(response.data);
    }
    catch (error) {
        console.log((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error);
        res.status(500).send("Internal Server Error");
    }
}));
LiveStreamRouter.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { liveChatId, message } = req.body;
        const accessToken = req.headers.authorization.split(" ")[1];
        const response = yield axios_1.default.post(`https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet`, {
            snippet: {
                liveChatId,
                type: "textMessageEvent",
                textMessageDetails: {
                    messageText: message,
                },
            },
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("watch os chat response", response.data);
        res.status(200).send(response.data);
    }
    catch (error) {
        console.log(error.response.data.error);
        res.status(500).send("Internal Server Error");
    }
}));
exports.default = LiveStreamRouter;
//# sourceMappingURL=LiveStreamRouter.js.map
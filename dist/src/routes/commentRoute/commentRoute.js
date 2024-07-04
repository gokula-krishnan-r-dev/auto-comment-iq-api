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
Object.defineProperty(exports, "__esModule", { value: true });
const DashboardU_1 = require("../../utils/DashboardU");
const express = require("express");
const commentRoute = express.Router();
commentRoute.post("/comment", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Missing required 'videoId' parameter",
                code: "400",
            });
        }
        const setActiveAutoComment = [];
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "User not authenticated",
                code: "401",
            });
        }
        yield (0, DashboardU_1.sendComment)(videoId, setActiveAutoComment);
        res.status(200).json({
            status: "Success",
            message: "Comment processing started",
            code: "200",
        });
    }
    catch (error) {
        console.error("Error processing comment:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Error processing comment",
        });
    }
}));
exports.default = commentRoute;
//# sourceMappingURL=commentRoute.js.map
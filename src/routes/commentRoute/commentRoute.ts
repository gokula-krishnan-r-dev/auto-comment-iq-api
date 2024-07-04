import { NextFunction, Request, Response } from "express";
import { sendComment } from "../../utils/DashboardU";

const express = require("express");
const commentRoute = express.Router();

commentRoute.post(
  "/comment",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;

      if (!videoId) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Missing required 'videoId' parameter",
          code: "400",
        });
      }

      const setActiveAutoComment: any = [];
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "User not authenticated",
          code: "401",
        });
      }

      await sendComment(videoId, setActiveAutoComment);

      res.status(200).json({
        status: "Success",
        message: "Comment processing started",
        code: "200",
      });
    } catch (error) {
      console.error("Error processing comment:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Error processing comment",
      });
    }
  }
);

export default commentRoute;

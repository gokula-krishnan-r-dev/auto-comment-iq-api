import { Request, Response } from "express";
import competitorModel, { ICompetitor } from "../../models/competitor.model";

const express = require("express");
const CompetitorRouter = express.Router();

CompetitorRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

CompetitorRouter.post("/save", async (req: Request, res: Response) => {
  try {
    const { userId, channelId, channelName, channelAvatar } = req.body;
    const competitor: ICompetitor = new competitorModel({
      userId,
      user: userId,
      channelId,
      channelName: channelName,
      channelAvatar: channelAvatar,
    });
    await competitor.save();
    res
      .status(201)
      .json({ message: "Competitor channelId saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

CompetitorRouter.get("/find/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const competitors = await competitorModel.find({ userId }).populate("user");
    res.status(200).json({ competitors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

CompetitorRouter.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await competitorModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Competitor channelId deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default CompetitorRouter;

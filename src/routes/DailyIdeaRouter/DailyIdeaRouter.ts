import { Router, Request, Response } from "express";
import IdeaModel, { Idea } from "../../models/idea.model";
import ideaSaveModel from "../../models/ideaSave.model";

const DailyIdea = Router();

DailyIdea.post("/ideas", async (req: Request, res: Response) => {
  try {
    const newIdeaData: Idea = req.body;
    const idea = new IdeaModel(newIdeaData);
    await idea.save();
    res.status(201).json({ message: "Idea added successfully", idea });
  } catch (err) {
    console.error("Error adding idea:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

DailyIdea.get("/ideas/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const ideas = await IdeaModel.find({ userId });
    res.status(200).json({ ideas });
  } catch (err) {
    console.error("Error fetching ideas:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

DailyIdea.post(
  "/ideas/save/:ideaId/:userId",
  async (req: Request, res: Response) => {
    try {
      const ideaId = req.params.ideaId;
      const userId = req.params.userId;
      const { isAccepted } = req.body;
      const idea = await ideaSaveModel.findOne({ ideaId });
      if (idea) {
        idea.isAccepted = isAccepted;
        await idea.save();
        return res.status(200).json({ message: "Idea updated successfully" });
      } else {
        const SaveIdea = new ideaSaveModel({
          userId,
          ideaId,
          isYouTuber: false,
          isAccepted,
        });
        await SaveIdea.save();
        res.status(201).json({ message: "Idea saved successfully", SaveIdea });
      }
    } catch (err) {
      console.error("Error updating idea:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
DailyIdea.get("/ideas/save/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const ideas = await ideaSaveModel
      .find({ userId })
      .populate("ideaId")
      .populate("userId");
    res.status(200).json({ ideas });
  } catch (err) {
    console.error("Error fetching ideas:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

DailyIdea.get("/ideas/ai/:userId", async (req: Request, res: Response) => {
  const { message, system } = req.query;
  const userId = req.params.userId;
  try {
    async function run(model, input) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
        {
          headers: {
            Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
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
      // Extract alternative title ideas from the response string
      const titlesString = response?.result?.response
        ?.split("\n")
        ?.filter((description) => description.trim() !== "");

      // Create a JSON-like structure for the titles
      const alternativeTitles = titlesString
        ?.slice(1, 6)
        .map((description, index) => ({
          index: index + 1,
          description: description.replace(/^\d+\.\s+/, ""),
        }));

      for (const title of alternativeTitles) {
        const idea = new IdeaModel({
          name: title.description,
          status: "completed",
          prediction: "High",
          userId,
        });
        idea.save();
      }
      res.status(201).json({ message: "Ideas created successfully" });
    });
  } catch {
    res.send("somethings Went Wrong !");
  }
});

export default DailyIdea;

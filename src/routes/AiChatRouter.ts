import { Request, Response } from "express";
import { IMessage, MessageModel } from "../models/ai.model";

const express = require("express");
const AiChatRouter = express.Router();

AiChatRouter.post("/messages", async (req: Request, res: Response) => {
  try {
    const { message, sender } = req.body;
    if (!message || !sender) {
      return res.status(400).json({ success: false, error: "Invalid request" });
    }

    const newMessage: any = { message, sender };
    const savedMessage = await MessageModel.create(newMessage);
    return res.status(201).json({
      success: true,
      message: "Message saved successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});
AiChatRouter.post("/llama70B", async (req: any, res: any) => {
  const apiKey =
    "f66a83cba77ea1064cdb2036161cb141aaf7c0a6597d19a35859048eaa890e58"; // Replace with your actual API key

  const { message: messageBody } = req.body;
  try {
    const url = "https://api.together.xyz/v1/chat/completions";

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    });

    const data = {
      model: "meta-llama/Llama-2-70b-chat-hf",
      max_tokens: 500,
      messages: messageBody,
    };

    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        res.json({ response: result.choices[0].message.content });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Respond with JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

AiChatRouter.get("/messages", async (_req: Request, res: Response) => {
  try {
    const messages = await MessageModel.find();
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

export default AiChatRouter;

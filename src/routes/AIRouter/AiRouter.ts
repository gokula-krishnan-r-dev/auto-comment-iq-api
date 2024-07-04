import express, { Request, Response } from "express";
const { Hercai } = require("hercai");

const AIRouter = express.Router();

const herc = new Hercai(); //new Hercai("your api key"); => Optional

AIRouter.get("/ai", (req: Request, res: Response) => {
  const message = req.query.message;
  herc.question({ model: "v3-beta", content: message }).then((response) => {
    return res.json({ reply: response?.reply });
  });
});
export default AIRouter;

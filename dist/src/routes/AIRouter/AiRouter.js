"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { Hercai } = require("hercai");
const AIRouter = express_1.default.Router();
const herc = new Hercai(); //new Hercai("your api key"); => Optional
AIRouter.get("/ai", (req, res) => {
    const message = req.query.message;
    herc.question({ model: "v3-beta", content: message }).then((response) => {
        return res.json({ reply: response === null || response === void 0 ? void 0 : response.reply });
    });
});
exports.default = AIRouter;
//# sourceMappingURL=AiRouter.js.map
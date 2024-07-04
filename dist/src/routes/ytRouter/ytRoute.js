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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const YtRouter = express_1.default.Router();
const createVideoEndpoint = (path) => {
    YtRouter.get(path, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const queryParams = new URLSearchParams(req.query);
            if (Object.keys(req.query).length === 0) {
                return res
                    .status(400)
                    .json({ message: "No query parameters provided" });
            }
            const apiUrl = `https://youtube.googleapis.com/youtube/v3${path}?${queryParams.toString()}`;
            const response = yield axios_1.default.get(apiUrl);
            const data = response.data;
            console.log(data);
            res.json({ data }); // Send response with dynamic key
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Failed to fetch YouTube data",
                error: error,
            });
        }
    }));
};
createVideoEndpoint("/videos");
createVideoEndpoint("/search");
createVideoEndpoint("/channels");
createVideoEndpoint("/commentThreads");
createVideoEndpoint("/thumbnails");
createVideoEndpoint("/members");
createVideoEndpoint("/comments");
createVideoEndpoint("/activities");
createVideoEndpoint("/captions");
exports.default = YtRouter;
//# sourceMappingURL=ytRoute.js.map
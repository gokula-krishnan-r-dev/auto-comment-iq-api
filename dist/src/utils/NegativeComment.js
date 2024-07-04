"use strict";
// utils/NegativeComment.ts
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
exports.analyzeSentiment = exports.getComments = void 0;
const dev_1 = require("../config/dev");
const getComments = (videoId, nextPageToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&part=replies&videoId=${videoId}&key=${dev_1.apiKey}&maxResults=5000&${nextPageToken ? `pageToken=${nextPageToken}` : ""}`);
        const data = yield response.json();
        if (response.ok) {
            return data;
        }
        else {
            throw new Error(data.error.message);
        }
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        return error;
    }
});
exports.getComments = getComments;
const analyzeSentiment = (text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`http://0.0.0.0:8000/sentiment?text=${text}`);
        if (!response.ok) {
            return response.json().then((error) => {
                throw new Error(error.error);
            });
        }
        return yield response.json().then((data) => {
            return data;
        });
    }
    catch (error) {
        console.error("Error analyzing sentiment:", error);
        throw error;
    }
});
exports.analyzeSentiment = analyzeSentiment;
//# sourceMappingURL=NegativeComment.js.map
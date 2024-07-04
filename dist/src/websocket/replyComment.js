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
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const DashboardU_1 = require("../utils/DashboardU");
const axios_1 = __importDefault(require("axios"));
const createWebSocketServer = () => {
    const server = http_1.default.createServer();
    const wss = new ws_1.default.Server({ server });
    wss.on("connection", (ws) => {
        console.log("New client connected");
        ws.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
            // ws.send(`Server received your message: ${message}`);
            const messageString = Buffer.from(message).toString("utf-8");
            // if (messageString === "hi") {
            const setActiveAutoComment = [];
            (0, DashboardU_1.sendComment)(messageString, setActiveAutoComment, ws);
            // }
            if (messageString === null || messageString === void 0 ? void 0 : messageString.includes("like")) {
            }
            if (messageString === null || messageString === void 0 ? void 0 : messageString.includes("subCount")) {
                const parts = messageString.split(":");
                // Take the second part (index 1) of the resulting array
                const id = parts[1];
                console.log(id.replace(/"/g, ""), "id");
                console.log(parts.map((part) => part.replace(/"/g, "")), "parts");
                let prevData = [];
                setInterval(() => {
                    const res = axios_1.default.get(`https://mixerno.space/api/youtube-channel-counter/user/${id.replace(/"/g, "")}`);
                    res
                        .then((response) => {
                        if (response.data !== null) {
                            // If response.data is not null, update prevData and send the response
                            prevData = response.data;
                            ws.send(JSON.stringify(response.data));
                        }
                        else {
                            // If response.data is null, send the previous value
                            ws.send(JSON.stringify(prevData));
                        }
                    })
                        .catch((error) => {
                        // Handle error if the request fails
                        console.error("Error fetching data:", error);
                    });
                }, 1000);
            }
        }));
        ws.on("close", () => {
            console.log("Client disconnected");
        });
    });
    server.listen(3002, () => {
        console.log(`WebSocket server is running on port 3002`);
    });
    return server;
};
exports.default = createWebSocketServer;
//# sourceMappingURL=replyComment.js.map
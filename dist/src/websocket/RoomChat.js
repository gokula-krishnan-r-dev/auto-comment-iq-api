"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./socket"));
const chat = require("express")();
// const http = require("http").createServer(chat);
const http_1 = __importDefault(require("http"));
// const io = require("socket.io")(http);
const PORT = process.env.PORT || 3003;
const httpServer = http_1.default.createServer(chat);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: [
            "http://localhost:3001",
            "*",
            "http://localhost:3001/chat",
            "http://localhost:8080",
        ],
    },
});
const Chat = () => {
    io.on("connection", socket_1.default);
    httpServer.listen(PORT, () => {
        console.log("Server is running at http://localhost:3003");
    });
    return chat;
};
exports.default = Chat;
//# sourceMappingURL=RoomChat.js.map
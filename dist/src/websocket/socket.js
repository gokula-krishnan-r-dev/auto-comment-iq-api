"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const MessageController_1 = __importDefault(require("./controllers/MessageController"));
const RoomController_1 = __importDefault(require("./controllers/RoomController"));
const TypingController_1 = __importDefault(require("./controllers/TypingController"));
const sockets = (socket) => {
    console.log("User connected.");
    const typingController = new TypingController_1.default(socket);
    const roomController = new RoomController_1.default(socket);
    const messageController = new MessageController_1.default(socket);
    socket.on("send-message", messageController.sendMessage);
    socket.on("add-heart", messageController.addHeart);
    socket.on("typing-started", typingController.typingStarted);
    socket.on("typing-stoped", typingController.typingStoped);
    socket.on("join-room", roomController.joinRoom);
    socket.on("new-room-created", roomController.newRoomCreated);
    socket.on("room-removed", roomController.roomRemoved);
    socket.on("is-online", roomController.isOnline);
    socket.on("add-online-user", roomController.addOnlineUser);
    socket.on("remove-online-user", roomController.removeOnlineUser);
    socket.on("add-emote", roomController.addEmote);
    socket.on("add-poll", roomController.addPoll);
    socket.on("get-poll", roomController.getPoll);
    socket.on("add-pin", roomController.addPin);
    socket.on("off-online", roomController.offOnline);
    socket.on("upload", ({ data, roomId }) => {
        fs_1.default.writeFile("upload/" + "test.png", data, { encoding: "base64" }, () => { });
        socket.to(roomId).emit("uploaded", { buffer: data.toString("base64") });
    });
    socket.on("disconnect", (socket) => {
        console.log("User left.", socket);
    });
};
exports.default = sockets;
//# sourceMappingURL=socket.js.map
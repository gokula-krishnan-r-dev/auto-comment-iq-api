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
const online_model_1 = __importDefault(require("../../models/online.model"));
const pin_model_1 = __importDefault(require("../../models/pin.model"));
const Message_1 = __importDefault(require("../models/Message"));
const Room_1 = __importDefault(require("../models/Room"));
const BaseController_1 = __importDefault(require("./BaseController"));
var people = [];
console.log(people, "people");
class RoomController extends BaseController_1.default {
    constructor() {
        super(...arguments);
        this.joinRoom = ({ roomId, userId }) => __awaiter(this, void 0, void 0, function* () {
            this.socket.join(roomId);
            try {
                const savedRoomId = roomId;
                let skt = this.socket.broadcast;
                skt = savedRoomId ? skt.to(savedRoomId) : skt;
                console.log("Number of users in room:", skt.adapter.rooms);
                const existingOnlineUser = yield online_model_1.default.findOne({ roomId });
                // this.socket.emit("get-online-user", { roomId, userId });
                skt.emit("get-online-user", { roomId, isOnline: true, userId });
                if (existingOnlineUser) {
                    // Check if the user is already online in this room
                    const userAlreadyExists = existingOnlineUser.user.includes(userId);
                    if (userAlreadyExists) {
                        console.log("User is already online in this room");
                        skt.emit("add-online-user", { roomId, isOnline: true, userId });
                        return;
                    }
                    else {
                        // Add the new user to the existing online users in the room
                        existingOnlineUser.user.push(userId);
                        yield existingOnlineUser.save();
                        skt.emit("get-online-user", { roomId, isOnline: true, userId });
                    }
                }
                else {
                    // If no online users exist for this room, create a new online user
                    const newOnlineUser = new online_model_1.default({
                        roomId,
                        userId,
                        user: [userId],
                    });
                    yield newOnlineUser.save();
                }
                skt.emit("get-online-user", { roomId, isOnline: true, userId });
                console.log("Online user added successfully");
            }
            catch (error) {
                console.error("Error adding online user:", error);
            }
        });
        this.newRoomCreated = ({ roomId, userId }) => {
            const room = new Room_1.default({
                name: "Test",
                roomId,
                userId,
            });
            room.save();
            this.socket.emit("new-room-created", { room });
        };
        this.roomRemoved = ({ roomId }) => __awaiter(this, void 0, void 0, function* () {
            yield Room_1.default.deleteOne({ roomId });
            this.socket.emit("room-removed", { roomId });
        });
        this.isOnline = ({ roomId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the room using the Room model
                const room = yield Room_1.default.findOne({ roomId });
                if (room) {
                    // Update the isOnline property
                    room.isOnline = true;
                    // Save the changes
                    yield room.save();
                    // Emit the "is-online" event to the specified room
                    // this.socket.to(roomId).emit("is-online", { roomId, isOnline: true });
                    let skt = this.socket.broadcast;
                    skt = roomId ? skt.to(roomId) : skt;
                    skt.emit("is-online-from-server", { roomId, isOnline: true });
                }
                else {
                    console.error(`Room with ID ${roomId} not found`);
                }
            }
            catch (error) {
                console.error("Error updating room:", error);
            }
        });
        this.offOnline = ({ roomId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the room using the Room model
                const room = yield Room_1.default.findOne({ roomId });
                if (room) {
                    // Update the isOnline property
                    room.isOnline = false;
                    // Save the changes
                    yield room.save();
                    let skt = this.socket.broadcast;
                    skt = roomId ? skt.to(roomId) : skt;
                    skt.emit("is-online-from-server", { roomId, isOnline: false });
                }
                else {
                    console.error(`Room with ID ${roomId} not found`);
                }
            }
            catch (error) {
                console.error("Error updating room:", error);
            }
        });
        this.addPoll = ({ roomId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("addPoll", roomId);
                let skt = this.socket.broadcast;
                skt = roomId ? skt.to(roomId) : skt;
                console.log("addPoll", roomId);
                skt.emit("poll-added", { roomId });
            }
            catch (error) {
                console.error("Error updating room:", error);
            }
        });
        this.getPoll = ({ roomId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("getPoll", roomId);
                let skt = this.socket.broadcast;
                skt = roomId ? skt.to(roomId) : skt;
                skt.emit("poll-get", { roomId });
            }
            catch (error) {
                console.error("Error updating room:", error);
            }
        });
        this.addPin = ({ userId, roomId, messageId, pinType, room }) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(room, "response");
                const pin = new pin_model_1.default({ roomId, userId, messageId, pinType, room });
                const pinRes = yield pin.save();
                const savedRoomId = pinRes === null || pinRes === void 0 ? void 0 : pinRes.room; // Use a different variable name here
                console.log(pinRes, "pinRes");
                let skt = this.socket.broadcast;
                skt = savedRoomId ? skt.to(savedRoomId) : skt;
                skt.emit("is-pinned", { pinRes });
            }
            catch (error) {
                console.error("Error adding pin:", error);
            }
        });
        this.addOnlineUser = ({ roomId, userId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const savedRoomId = roomId;
                let skt = this.socket.broadcast;
                skt = savedRoomId ? skt.to(savedRoomId) : skt;
                console.log("Number of users in room:", skt.adapter.rooms);
                const existingOnlineUser = yield online_model_1.default.findOne({ roomId });
                if (existingOnlineUser) {
                    // Check if the user is already online in this room
                    const userAlreadyExists = existingOnlineUser.user.includes(userId);
                    if (userAlreadyExists) {
                        console.log("User is already online in this room");
                        return;
                    }
                    else {
                        // Add the new user to the existing online users in the room
                        existingOnlineUser.user.push(userId);
                        yield existingOnlineUser.save();
                    }
                }
                else {
                    // If no online users exist for this room, create a new online user
                    const newOnlineUser = new online_model_1.default({
                        roomId,
                        userId,
                        user: [userId],
                    });
                    yield newOnlineUser.save();
                }
                console.log("Online user added successfully");
            }
            catch (error) {
                console.error("Error adding online user:", error);
            }
        });
        this.removeOnlineUser = ({ roomId, userId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the online user in the specified room
                const existingOnlineUser = yield online_model_1.default.findOne({ roomId });
                console.log("Existing online user:", existingOnlineUser);
                if (existingOnlineUser) {
                    // Remove the user from the online users in the room
                    existingOnlineUser.user = existingOnlineUser.user.filter((user) => user.toString() !== userId);
                    console.log("Updated online users:", existingOnlineUser.user);
                    // Save the updated online user document
                    yield existingOnlineUser.save();
                    console.log("Online user document saved successfully");
                }
                else {
                    console.log("Online user not found for roomId:", roomId);
                }
                console.log("Number of users in room:", this.socket.adapter.rooms);
                // Broadcast to all clients in the room that the user is now offline
                let skt = this.socket.broadcast;
                skt = roomId ? skt.to(roomId) : skt;
                skt.emit("get-online-user", { roomId, isOnline: false, userId });
                console.log("Online user removed successfully");
            }
            catch (error) {
                console.error("Error removing online user:", error);
            }
        });
        this.addEmote = ({ roomId, emote, messageId, userId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(messageId, roomId);
                // Check if the user has already added the emote
                const existingMessage = yield Message_1.default.findOneAndUpdate({
                    _id: messageId,
                    "emotes.userId": userId, // Check if user has already added the emote
                }, {
                    $set: {
                        "emotes.$.emoteString": emote, // Update the emote
                        // Increment the count
                    },
                }, { new: true });
                if (!existingMessage) {
                    // If emote doesn't exist for the user, add it
                    const message = yield Message_1.default.findOneAndUpdate({
                        _id: messageId,
                        "emotes.emoteString": { $ne: emote }, // Ensure emoteString doesn't already exist
                    }, {
                        $addToSet: {
                            emotes: {
                                emoteString: emote,
                                userId: userId,
                                roomId: roomId,
                                user: userId,
                            },
                        },
                    }, { new: true });
                    if (!message) {
                        console.log("Message not found");
                        return;
                    }
                }
                let skt = this.socket.broadcast;
                skt = roomId ? skt.to(roomId) : skt;
                skt.emit("emote-added", { emote });
            }
            catch (error) {
                console.error("Error adding emote:", error);
            }
        });
    }
}
exports.default = RoomController;
//# sourceMappingURL=RoomController.js.map
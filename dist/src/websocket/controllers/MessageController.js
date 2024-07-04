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
const BaseController_1 = __importDefault(require("./BaseController"));
const Message_1 = __importDefault(require("../models/Message"));
class MessageController extends BaseController_1.default {
    constructor() {
        super(...arguments);
        this.sendMessage = ({ message, roomId, image_text, userId, type, image, pollId, replyMessage, replyTo, }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = new Message_1.default({
                    message,
                    roomId,
                    userId,
                    type,
                    image,
                    pollId,
                    image_text,
                    replyMessage,
                    replyTo,
                });
                yield newMessage.save();
                console.log("saved");
                let skt = this.socket.broadcast;
                skt = roomId ? skt.to(roomId) : skt;
                skt.emit("message-from-server", { message });
            }
            catch (error) {
                console.error("Error saving message:", error);
            }
        });
        this.addHeart = ({ messageId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(messageId, "messageId");
                const message = yield Message_1.default.findById(messageId);
                console.log(message);
                message.heart = !message.heart;
                yield message.save();
                this.socket.broadcast.emit("heart-added", { messageId });
            }
            catch (error) {
                console.error("Error adding heart:", error);
            }
        });
    }
}
exports.default = MessageController;
//# sourceMappingURL=MessageController.js.map
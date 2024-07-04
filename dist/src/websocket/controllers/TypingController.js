"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./BaseController"));
class TypingController extends BaseController_1.default {
    constructor() {
        super(...arguments);
        this.typingStarted = ({ roomId }) => {
            let skt = this.socket.broadcast;
            skt = roomId ? skt.to(roomId) : skt;
            skt.emit("typing-started-from-server");
        };
        this.typingStoped = ({ roomId }) => {
            let skt = this.socket.broadcast;
            skt = roomId ? skt.to(roomId) : skt;
            skt.emit("typing-stoped-from-server");
        };
    }
}
exports.default = TypingController;
//# sourceMappingURL=TypingController.js.map
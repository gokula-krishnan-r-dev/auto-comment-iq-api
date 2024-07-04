import BaseController from "./BaseController";
import MessageModel from "../models/Message";

export default class MessageController extends BaseController {
  sendMessage = async ({
    message,
    roomId,
    image_text,
    userId,
    type,
    image,
    pollId,
    replyMessage,
    replyTo,
  }) => {
    try {
      const newMessage = new MessageModel({
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
      await newMessage.save();
      console.log("saved");

      let skt = this.socket.broadcast;
      skt = roomId ? skt.to(roomId) : skt;
      skt.emit("message-from-server", { message });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };
  addHeart = async ({ messageId }) => {
    try {
      console.log(messageId, "messageId");
      const message = await MessageModel.findById(messageId);
      console.log(message);
      message.heart = !message.heart;
      await message.save();
      this.socket.broadcast.emit("heart-added", { messageId });
    } catch (error) {
      console.error("Error adding heart:", error);
    }
  };
}

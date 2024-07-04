import { Types } from "mongoose";
import onlineUser from "../../models/online.model";
import pinModel from "../../models/pin.model";
import MessageModel from "../models/Message";
import Room from "../models/Room";
import BaseController from "./BaseController";
var people = [];
console.log(people, "people");

export default class RoomController extends BaseController {
  joinRoom = async ({ roomId, userId }) => {
    this.socket.join(roomId);
    try {
      const savedRoomId = roomId;
      let skt = this.socket.broadcast;
      skt = savedRoomId ? skt.to(savedRoomId) : skt;
      console.log("Number of users in room:", skt.adapter.rooms);
      const existingOnlineUser = await onlineUser.findOne({ roomId });
      // this.socket.emit("get-online-user", { roomId, userId });

      skt.emit("get-online-user", { roomId, isOnline: true, userId });

      if (existingOnlineUser) {
        // Check if the user is already online in this room
        const userAlreadyExists = existingOnlineUser.user.includes(userId);

        if (userAlreadyExists) {
          console.log("User is already online in this room");
          skt.emit("add-online-user", { roomId, isOnline: true, userId });
          return;
        } else {
          // Add the new user to the existing online users in the room
          existingOnlineUser.user.push(userId);
          await existingOnlineUser.save();
          skt.emit("get-online-user", { roomId, isOnline: true, userId });
        }
      } else {
        // If no online users exist for this room, create a new online user
        const newOnlineUser = new onlineUser({
          roomId,
          userId,
          user: [userId],
        });
        await newOnlineUser.save();
      }
      skt.emit("get-online-user", { roomId, isOnline: true, userId });
      console.log("Online user added successfully");
    } catch (error) {
      console.error("Error adding online user:", error);
    }
  };

  newRoomCreated = ({ roomId, userId }) => {
    const room = new Room({
      name: "Test",
      roomId,
      userId,
    });
    room.save();
    this.socket.emit("new-room-created", { room });
  };

  roomRemoved = async ({ roomId }) => {
    await Room.deleteOne({ roomId });
    this.socket.emit("room-removed", { roomId });
  };
  isOnline = async ({ roomId }) => {
    try {
      // Find the room using the Room model
      const room = await Room.findOne({ roomId });

      if (room) {
        // Update the isOnline property
        room.isOnline = true;

        // Save the changes
        await room.save();

        // Emit the "is-online" event to the specified room
        // this.socket.to(roomId).emit("is-online", { roomId, isOnline: true });
        let skt = this.socket.broadcast;
        skt = roomId ? skt.to(roomId) : skt;
        skt.emit("is-online-from-server", { roomId, isOnline: true });
      } else {
        console.error(`Room with ID ${roomId} not found`);
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };
  offOnline = async ({ roomId }) => {
    try {
      // Find the room using the Room model
      const room = await Room.findOne({ roomId });

      if (room) {
        // Update the isOnline property
        room.isOnline = false;

        // Save the changes
        await room.save();

        let skt = this.socket.broadcast;
        skt = roomId ? skt.to(roomId) : skt;
        skt.emit("is-online-from-server", { roomId, isOnline: false });
      } else {
        console.error(`Room with ID ${roomId} not found`);
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };
  addPoll = async ({ roomId }) => {
    try {
      console.log("addPoll", roomId);

      let skt = this.socket.broadcast;
      skt = roomId ? skt.to(roomId) : skt;
      console.log("addPoll", roomId);
      skt.emit("poll-added", { roomId });
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };
  getPoll = async ({ roomId }) => {
    try {
      console.log("getPoll", roomId);
      let skt = this.socket.broadcast;
      skt = roomId ? skt.to(roomId) : skt;
      skt.emit("poll-get", { roomId });
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };
  addPin = async ({ userId, roomId, messageId, pinType, room }) => {
    try {
      console.log(room, "response");

      const pin = new pinModel({ roomId, userId, messageId, pinType, room });
      const pinRes = await pin.save();
      const savedRoomId = pinRes?.room; // Use a different variable name here
      console.log(pinRes, "pinRes");

      let skt = this.socket.broadcast;
      skt = savedRoomId ? skt.to(savedRoomId) : skt;
      skt.emit("is-pinned", { pinRes });
    } catch (error) {
      console.error("Error adding pin:", error);
    }
  };

  addOnlineUser = async ({ roomId, userId }) => {
    try {
      const savedRoomId = roomId;
      let skt = this.socket.broadcast;
      skt = savedRoomId ? skt.to(savedRoomId) : skt;
      console.log("Number of users in room:", skt.adapter.rooms);
      const existingOnlineUser = await onlineUser.findOne({ roomId });

      if (existingOnlineUser) {
        // Check if the user is already online in this room
        const userAlreadyExists = existingOnlineUser.user.includes(userId);

        if (userAlreadyExists) {
          console.log("User is already online in this room");
          return;
        } else {
          // Add the new user to the existing online users in the room
          existingOnlineUser.user.push(userId);
          await existingOnlineUser.save();
        }
      } else {
        // If no online users exist for this room, create a new online user
        const newOnlineUser = new onlineUser({
          roomId,
          userId,
          user: [userId],
        });
        await newOnlineUser.save();
      }

      console.log("Online user added successfully");
    } catch (error) {
      console.error("Error adding online user:", error);
    }
  };
  removeOnlineUser = async ({ roomId, userId }) => {
    try {
      // Find the online user in the specified room
      const existingOnlineUser = await onlineUser.findOne({ roomId });
      console.log("Existing online user:", existingOnlineUser);

      if (existingOnlineUser) {
        // Remove the user from the online users in the room
        existingOnlineUser.user = existingOnlineUser.user.filter(
          (user) => user.toString() !== userId
        );
        console.log("Updated online users:", existingOnlineUser.user);

        // Save the updated online user document
        await existingOnlineUser.save();
        console.log("Online user document saved successfully");
      } else {
        console.log("Online user not found for roomId:", roomId);
      }

      console.log("Number of users in room:", this.socket.adapter.rooms);

      // Broadcast to all clients in the room that the user is now offline
      let skt = this.socket.broadcast;
      skt = roomId ? skt.to(roomId) : skt;
      skt.emit("get-online-user", { roomId, isOnline: false, userId });

      console.log("Online user removed successfully");
    } catch (error) {
      console.error("Error removing online user:", error);
    }
  };
  addEmote = async ({ roomId, emote, messageId, userId }) => {
    try {
      console.log(messageId, roomId);

      // Check if the user has already added the emote
      const existingMessage = await MessageModel.findOneAndUpdate(
        {
          _id: messageId,
          "emotes.userId": userId, // Check if user has already added the emote
        },
        {
          $set: {
            "emotes.$.emoteString": emote, // Update the emote
            // Increment the count
          },
        },
        { new: true }
      );

      if (!existingMessage) {
        // If emote doesn't exist for the user, add it
        const message = await MessageModel.findOneAndUpdate(
          {
            _id: messageId,
            "emotes.emoteString": { $ne: emote }, // Ensure emoteString doesn't already exist
          },
          {
            $addToSet: {
              emotes: {
                emoteString: emote,
                userId: userId,
                roomId: roomId,
                user: userId,
              },
            },
          },
          { new: true }
        );

        if (!message) {
          console.log("Message not found");
          return;
        }
      }

      let skt = this.socket.broadcast;
      skt = roomId ? skt.to(roomId) : skt;
      skt.emit("emote-added", { emote });
    } catch (error) {
      console.error("Error adding emote:", error);
    }
  };
}

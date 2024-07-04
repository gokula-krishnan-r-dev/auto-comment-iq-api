"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/OnlineUser.ts
const mongoose_1 = require("mongoose");
const onlineUserSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    roomId: { type: String, required: true },
    user: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "users" }],
}, {
    timestamps: true,
    unique: true,
});
const onlineUser = (0, mongoose_1.model)("OnlineUser", onlineUserSchema);
exports.default = onlineUser;
//# sourceMappingURL=online.model.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkModel = void 0;
const mongoose_1 = require("mongoose");
// Define bookmark schema
const bookmarkSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "users", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    bookmarks: { type: mongoose_1.Schema.Types.ObjectId, ref: "job_ads" },
}, {
    timestamps: true,
});
// Define bookmark model
const BookmarkModel = (0, mongoose_1.model)("bookmarks", bookmarkSchema);
exports.BookmarkModel = BookmarkModel;
//# sourceMappingURL=adsboockmark.model.js.map
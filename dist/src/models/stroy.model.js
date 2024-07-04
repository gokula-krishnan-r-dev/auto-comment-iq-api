"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const storySchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    type: { type: String, required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "users", required: true },
    ads_link: String,
    ads_image: String,
    ads_title: String,
    ads_description: String,
    ads_price: String,
    ads_location: String,
    ads_contact: String,
    ads_category: String,
    active_ads: Boolean,
    ads_id: String,
    ads_company: String,
    ads_email: String,
});
// Create a Mongoose model for the 'stories' collection
const StoryModel = (0, mongoose_1.model)("Story", storySchema);
exports.default = StoryModel;
//# sourceMappingURL=stroy.model.js.map
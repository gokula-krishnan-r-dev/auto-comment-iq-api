"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jobAdSchema = new mongoose_1.Schema({
    title: String,
    description: String,
    companyName: String,
    type: String,
    location: String,
    pricePerVideo: Number,
    city: {
        type: String,
        enum: ["chennai", "tamil nadu"],
    },
    requirements: String,
    level: String,
    contact_number: String,
    isKids: { type: Boolean, default: false },
    category: String,
    is18plus: { type: Boolean, default: false },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const JobAd = (0, mongoose_1.model)("job_ads", jobAdSchema);
exports.default = JobAd;
//# sourceMappingURL=adsjob.model.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const adSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    url: { type: String, required: true },
    ads_company_name: { type: String, required: true },
    ads_company_website: { type: String, required: true },
    ads_company_email: { type: String, required: true },
    ads_company_phone: { type: String, required: true },
    ads_company_address: { type: String, required: true },
    to_skip: { type: Number, required: false, default: 30 },
    ads_company_country: { type: String, required: true },
    ads_company_logo: { type: String, required: false },
    ads_thumbnail: { type: String, required: false },
    ads_placement: { type: String, required: false, default: "full" },
    roomId: { type: String },
    room: { type: String },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "users" },
    userId: { type: mongoose_1.Schema.Types.ObjectId },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});
const Ad = mongoose_1.default.model("Ad", adSchema);
exports.default = Ad;
//# sourceMappingURL=ad.model.js.map
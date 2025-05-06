"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const ReviewSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    communication: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    quality: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    timeliness: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Review", ReviewSchema);

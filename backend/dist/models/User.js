"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["FREELANCER"] = "FREELANCER";
    Role["EMPLOYER"] = "EMPLOYER";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER,
    },
    phoneNumber: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    bio: {
        type: String,
    },
    location: {
        type: Object,
    },
    skills: {
        type: [String],
        default: [],
    },
    portfolio: {
        type: [Object],
        default: [],
    },
    languages: {
        type: [Object],
        default: [],
    },
    education: {
        type: [Object],
        default: [],
    },
    experience: {
        type: [Object],
        default: [],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationDetails: {
        type: Object,
    },
    rating: {
        type: Number,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
    completedJobs: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", UserSchema);

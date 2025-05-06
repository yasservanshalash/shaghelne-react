"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobStatus = exports.JobType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
var JobType;
(function (JobType) {
    JobType["FULL_TIME"] = "FULL_TIME";
    JobType["PART_TIME"] = "PART_TIME";
    JobType["CONTRACT"] = "CONTRACT";
    JobType["FREELANCE"] = "FREELANCE";
    JobType["INTERNSHIP"] = "INTERNSHIP";
})(JobType || (exports.JobType = JobType = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["OPEN"] = "OPEN";
    JobStatus["CLOSED"] = "CLOSED";
    JobStatus["DRAFT"] = "DRAFT";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
const JobSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    jobType: {
        type: String,
        enum: Object.values(JobType),
        default: JobType.FULL_TIME,
    },
    location: {
        type: Object,
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: false,
    },
    requirements: {
        type: [String],
        default: [],
    },
    company: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(JobStatus),
        default: JobStatus.OPEN,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Job", JobSchema);

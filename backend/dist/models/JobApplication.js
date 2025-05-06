"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
var JobApplicationStatus;
(function (JobApplicationStatus) {
    JobApplicationStatus["PENDING"] = "PENDING";
    JobApplicationStatus["ACCEPTED"] = "ACCEPTED";
    JobApplicationStatus["REJECTED"] = "REJECTED";
    JobApplicationStatus["WITHDRAWN"] = "WITHDRAWN";
})(JobApplicationStatus || (exports.JobApplicationStatus = JobApplicationStatus = {}));
const JobApplicationSchema = new Schema({
    coverLetter: {
        type: String,
        required: true,
    },
    expectedSalary: {
        type: Number,
    },
    status: {
        type: String,
        enum: Object.values(JobApplicationStatus),
        default: JobApplicationStatus.PENDING,
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    attachments: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("JobApplication", JobApplicationSchema);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
var ProposalStatus;
(function (ProposalStatus) {
    ProposalStatus["PENDING"] = "PENDING";
    ProposalStatus["ACCEPTED"] = "ACCEPTED";
    ProposalStatus["REJECTED"] = "REJECTED";
    ProposalStatus["WITHDRAWN"] = "WITHDRAWN";
})(ProposalStatus || (exports.ProposalStatus = ProposalStatus = {}));
const ProposalSchema = new Schema({
    coverLetter: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    timeframe: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(ProposalStatus),
        default: ProposalStatus.PENDING,
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
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
    milestones: {
        type: [Object],
        default: [],
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Proposal", ProposalSchema);

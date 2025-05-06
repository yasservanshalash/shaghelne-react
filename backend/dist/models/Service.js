"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus["ACTIVE"] = "ACTIVE";
    ServiceStatus["PAUSED"] = "PAUSED";
    ServiceStatus["DELETED"] = "DELETED";
})(ServiceStatus || (exports.ServiceStatus = ServiceStatus = {}));
const ServiceSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: Object.values(ServiceStatus),
        default: ServiceStatus.ACTIVE,
    },
    deliveryTime: {
        type: Number,
        required: true,
    },
    revisions: {
        type: Number,
        required: true,
    },
    features: {
        type: [String],
        default: [],
    },
    requirements: {
        type: String,
    },
    images: {
        type: [String],
        default: [],
    },
    attachments: {
        type: [String],
        default: [],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Service", ServiceSchema);

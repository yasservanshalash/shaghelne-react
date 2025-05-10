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
    ServiceStatus["IN_QUEUE"] = "IN_QUEUE";
    ServiceStatus["COMPLETED"] = "COMPLETED";
    ServiceStatus["CANCELLED"] = "CANCELLED";
})(ServiceStatus || (exports.ServiceStatus = ServiceStatus = {}));
const PackagePlanSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    deliveryTime: Number,
    revisions: Number,
    features: [String],
    includedPages: Number
});
const FaqSchema = new Schema({
    question: String,
    answer: String
});
const ExtraServiceSchema = new Schema({
    title: String,
    price: Number,
    deliveryTime: Number
});
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
    sequentialId: {
        type: Number,
        unique: true,
        index: true
    },
    rating: {
        type: Number,
        default: 5.0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    inQueueCount: {
        type: Number,
        default: 0
    },
    completedCount: {
        type: Number,
        default: 0
    },
    authorName: String,
    authorImage: String,
    location: String,
    tools: {
        type: [String],
        default: []
    },
    deviceTypes: {
        type: [String],
        default: []
    },
    appTypes: {
        type: [String],
        default: []
    },
    language: {
        type: [String],
        default: []
    },
    level: {
        type: String,
        default: "All levels"
    },
    tags: {
        type: [String],
        default: []
    },
    faq: {
        type: [FaqSchema],
        default: []
    },
    extraServices: {
        type: [ExtraServiceSchema],
        default: []
    },
    packagePlans: {
        basic: PackagePlanSchema,
        standard: PackagePlanSchema,
        premium: PackagePlanSchema
    },
    completionTime: {
        type: Number,
        default: function () {
            return this.deliveryTime || 3;
        }
    },
    lastDeliveryDate: Date
}, { timestamps: true });
exports.default = mongoose_1.default.model("Service", ServiceSchema);

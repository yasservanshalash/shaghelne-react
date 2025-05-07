import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export enum ServiceStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  DELETED = "DELETED",
  IN_QUEUE = "IN_QUEUE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export interface PackagePlan {
  title: string;
  price: number;
  description: string;
  deliveryTime: number;
  revisions: number;
  features: string[];
  includedPages: number;
}

export type ServiceDocument = Document & {
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  status: ServiceStatus;
  deliveryTime: number;
  revisions: number;
  features: string[];
  requirements?: string;
  images: string[];
  attachments: string[];
  userId: string;
  sequentialId: number;
  rating: number;
  reviewCount: number;
  viewCount: number;
  inQueueCount: number;
  completedCount: number;
  authorName?: string;
  authorImage?: string;
  location?: string;
  tools?: string[];
  deviceTypes?: string[];
  appTypes?: string[];
  language?: string[];
  level?: string;
  tags?: string[];
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  extraServices?: Array<{
    title: string;
    price: number;
    deliveryTime: number;
  }>;
  packagePlans?: {
    basic: PackagePlan;
    standard: PackagePlan;
    premium: PackagePlan;
  };
  completionTime?: number; // Average completion time in days
  lastDeliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

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

const ServiceSchema = new Schema(
  {
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
      default: function() {
        return this.deliveryTime || 3;
      }
    },
    lastDeliveryDate: Date
  },
  { timestamps: true }
);

export default mongoose.model<ServiceDocument>("Service", ServiceSchema); 
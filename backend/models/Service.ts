import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export enum ServiceStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  DELETED = "DELETED"
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
  createdAt: Date;
  updatedAt: Date;
};

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
  },
  { timestamps: true }
);

export default mongoose.model<ServiceDocument>("Service", ServiceSchema); 
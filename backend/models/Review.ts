import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export type ReviewDocument = Document & {
  rating: number;
  comment: string;
  communication: number;
  quality: number;
  timeliness: number;
  userId: string;
  serviceId: string;
  createdAt: Date;
  updatedAt: Date;
};

const ReviewSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<ReviewDocument>("Review", ReviewSchema); 
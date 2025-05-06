import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export enum ProjectStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export type ProjectDocument = Document & {
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  status: ProjectStatus;
  category: string;
  subcategory: string;
  skills: string[];
  attachments: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.OPEN,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: false,
    },
    skills: {
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

export default mongoose.model<ProjectDocument>("Project", ProjectSchema); 
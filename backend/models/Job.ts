import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  FREELANCE = "FREELANCE",
  INTERNSHIP = "INTERNSHIP"
}

export enum JobStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  DRAFT = "DRAFT"
}

export type JobDocument = Document & {
  title: string;
  description: string;
  salary: number;
  jobType: JobType;
  location?: {
    city: string;
    subCity: string;
    specificArea: string;
  };
  category: string;
  subcategory: string;
  requirements: string[];
  company: {
    name: string;
    size: string;
    industry: string;
  };
  status: JobStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

const JobSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<JobDocument>("Job", JobSchema); 
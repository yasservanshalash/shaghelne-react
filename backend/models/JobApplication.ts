import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export enum JobApplicationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN"
}

export type JobApplicationDocument = Document & {
  coverLetter: string;
  expectedSalary?: number;
  status: JobApplicationStatus;
  jobId: string;
  userId: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
};

const JobApplicationSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<JobApplicationDocument>("JobApplication", JobApplicationSchema); 
import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export enum ProposalStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN"
}

export type ProposalDocument = Document & {
  coverLetter: string;
  price: number;
  timeframe: number;
  status: ProposalStatus;
  projectId: string;
  userId: string;
  attachments: string[];
  milestones: any[];
  createdAt: Date;
  updatedAt: Date;
};

const ProposalSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<ProposalDocument>("Proposal", ProposalSchema); 
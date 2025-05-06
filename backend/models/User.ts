import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export enum Role {
  USER = "USER",
  FREELANCER = "FREELANCER",
  EMPLOYER = "EMPLOYER",
  ADMIN = "ADMIN"
}

export type UserDocument = Document & {
  email: string;
  name: string;
  password: string;
  role: Role;
  phoneNumber?: string;
  profileImage?: string;
  bio?: string;
  location?: {
    city: string;
    subCity: string;
    specificArea: string;
  };
  skills: string[];
  portfolio: any[];
  languages: any[];
  education: any[];
  experience: any[];
  isVerified: boolean;
  verificationDetails?: any;
  rating?: number;
  totalReviews: number;
  completedJobs: number;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phoneNumber: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    bio: {
      type: String,
    },
    location: {
      type: Object,
    },
    skills: {
      type: [String],
      default: [],
    },
    portfolio: {
      type: [Object],
      default: [],
    },
    languages: {
      type: [Object],
      default: [],
    },
    education: {
      type: [Object],
      default: [],
    },
    experience: {
      type: [Object],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDetails: {
      type: Object,
    },
    rating: {
      type: Number,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<UserDocument>("User", UserSchema); 
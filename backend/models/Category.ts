import mongoose, { Document, Schema } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  description: string;
  subcategories: string[];
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    subcategories: [{
      type: String,
      trim: true
    }],
    icon: {
      type: String
    }
  },
  { timestamps: true }
);

const Category = mongoose.model<CategoryDocument>('Category', categorySchema);

export default Category; 
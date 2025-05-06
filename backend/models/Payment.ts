import mongoose, { Document, Schema } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentType {
  PAYMENT = 'PAYMENT',
  WITHDRAWAL = 'WITHDRAWAL',
  REFUND = 'REFUND'
}

export interface PaymentDocument extends Document {
  amount: number;
  userId: mongoose.Types.ObjectId;
  status: PaymentStatus;
  type: PaymentType;
  description: string;
  transactionId?: string;
  serviceId?: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  paymentMethod?: string;
  paymentDetails?: any;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    amount: {
      type: Number,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },
    type: {
      type: String,
      enum: Object.values(PaymentType),
      required: true
    },
    description: {
      type: String,
      required: true
    },
    transactionId: {
      type: String
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service'
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    paymentMethod: {
      type: String
    },
    paymentDetails: {
      type: Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

// Index for query optimization
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model<PaymentDocument>('Payment', paymentSchema);

export default Payment; 
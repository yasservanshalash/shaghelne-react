import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  JOB = 'JOB',
  PROJECT = 'PROJECT',
  MESSAGE = 'MESSAGE',
  PAYMENT = 'PAYMENT',
  SERVICE = 'SERVICE',
  REVIEW = 'REVIEW'
}

export interface NotificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.SYSTEM
    },
    read: {
      type: Boolean,
      default: false
    },
    link: {
      type: String
    },
    relatedId: {
      type: Schema.Types.ObjectId
    }
  },
  { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = mongoose.model<NotificationDocument>('Notification', notificationSchema);

export default Notification; 
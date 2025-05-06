import mongoose, { Document, Schema } from 'mongoose';

export interface MessageDocument extends Document {
  content: string;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  read: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<MessageDocument>(
  {
    content: {
      type: String,
      required: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    read: {
      type: Boolean,
      default: false
    },
    attachments: [{
      type: String
    }]
  },
  { timestamps: true }
);

// Index for efficiently retrieving conversations
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ receiverId: 1, senderId: 1 });

const Message = mongoose.model<MessageDocument>('Message', messageSchema);

export default Message; 
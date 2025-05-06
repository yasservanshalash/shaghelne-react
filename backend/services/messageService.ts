import Message, { MessageDocument } from '../models/Message';
import mongoose from 'mongoose';
import { NotificationType } from '../models/Notification';
import NotificationService from './notificationService';

interface MessageInput {
  content: string;
  attachments?: string[];
}

class MessageService {
  static async getAll(userId: string) {
    return Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    })
    .sort({ createdAt: -1 })
    .exec();
  }

  static async getById(messageId: string) {
    return Message.findById(messageId).exec();
  }

  static async create(senderId: string, receiverId: string, data: MessageInput) {
    const message = new Message({
      content: data.content,
      senderId,
      receiverId,
      attachments: data.attachments || []
    });

    const savedMessage = await message.save();

    // Create notification for receiver
    await NotificationService.create({
      userId: receiverId,
      title: 'New Message',
      message: 'You have received a new message',
      type: NotificationType.MESSAGE,
      relatedId: savedMessage._id
    });

    return savedMessage;
  }

  static async getConversation(userId1: string, userId2: string) {
    return Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    })
    .sort({ createdAt: 1 })
    .exec();
  }

  static async getConversations(userId: string) {
    // Aggregate to get the latest message from each conversation
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', new mongoose.Types.ObjectId(userId)] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          user: {
            _id: 1,
            name: 1,
            profileImage: 1
          }
        }
      }
    ]);

    return conversations;
  }

  static async markAsRead(messageId: string) {
    return Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    ).exec();
  }

  static async delete(messageId: string) {
    return Message.findByIdAndDelete(messageId).exec();
  }
}

export default MessageService; 
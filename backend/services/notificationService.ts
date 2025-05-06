// This is a simple notification service for our backend
// In a real application, you might connect to a notification system or database table

import Notification, { NotificationType, NotificationDocument } from '../models/Notification';
import mongoose from 'mongoose';

interface NotificationInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read?: boolean;
  link?: string;
  relatedId?: mongoose.Types.ObjectId | string;
}

class NotificationService {
  static async getAll(userId: string) {
    return Notification.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }
  
  static async getById(notificationId: string) {
    const notification = await Notification.findById(notificationId).exec();
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    return notification;
  }
  
  static async create(data: NotificationInput) {
    const newNotification = new Notification({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      read: data.read || false,
      link: data.link,
      relatedId: data.relatedId
    });
    
    return newNotification.save();
  }
  
  static async markAsRead(notificationId: string) {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    ).exec();
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    return notification;
  }
  
  static async markAllAsRead(userId: string) {
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    ).exec();
    
    return { 
      message: `Marked ${result.modifiedCount} notifications as read`,
      count: result.modifiedCount
    };
  }
  
  static async delete(notificationId: string) {
    const notification = await Notification.findByIdAndDelete(notificationId).exec();
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    return { message: 'Notification deleted successfully' };
  }
}

export default NotificationService; 
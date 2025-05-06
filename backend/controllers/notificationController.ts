import { Request, Response } from 'express';
import NotificationService from '../services/notificationService';
import { NotificationType } from '../models/Notification';

// Extended Request interface to include user
interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

interface NotificationBody {
  title: string;
  message: string;
  type: NotificationType;
  userId?: string;
  link?: string;
  relatedId?: string;
}

class NotificationController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const notifications = await NotificationService.getAll(userId);
      
      return res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const notification = await NotificationService.getById(id);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      // Check if user is authorized to access this notification
      if (notification.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this notification'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: notification
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const data: NotificationBody = req.body;
      const isAdmin = req.user.role === 'ADMIN';
      
      // Validation
      if (!data.title || !data.message || !data.type) {
        return res.status(400).json({
          success: false,
          message: 'Title, message and type are required'
        });
      }
      
      // Only admins can create notifications for other users
      if (data.userId && data.userId !== req.user.id && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to create notifications for other users'
        });
      }
      
      // If userId is not provided or is not an admin, use the current user's ID
      if (!data.userId || !isAdmin) {
        data.userId = req.user.id;
      }
      
      const notification = await NotificationService.create(data);
      
      return res.status(201).json({
        success: true,
        data: notification
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async markAsRead(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const notification = await NotificationService.getById(id);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }
      
      // Only the recipient can mark a notification as read
      if (notification.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to mark this notification as read'
        });
      }
      
      const updatedNotification = await NotificationService.markAsRead(id);
      
      return res.status(200).json({
        success: true,
        data: updatedNotification
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      
      await NotificationService.markAllAsRead(userId);
      
      return res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const notification = await NotificationService.getById(id);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }
      
      // Only the recipient can delete their notification
      if (notification.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this notification'
        });
      }
      
      await NotificationService.delete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default NotificationController; 
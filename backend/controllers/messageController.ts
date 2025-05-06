import { Request, Response } from 'express';
import MessageService from '../services/messageService';

// Extended Request interface to include user
interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

interface MessageBody {
  content: string;
  receiverId: string;
  attachments?: string[];
}

class MessageController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const messages = await MessageService.getAll(userId);
      
      return res.status(200).json({
        success: true,
        data: messages
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
      const message = await MessageService.getById(id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }

      // Check if user is the sender or receiver
      if (message.senderId.toString() !== req.user.id && message.receiverId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this message'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: message
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
      const userId = req.user.id;
      const { content, receiverId, attachments }: MessageBody = req.body;
      
      // Validation
      if (!content || !receiverId) {
        return res.status(400).json({
          success: false,
          message: 'Content and receiver ID are required'
        });
      }
      
      if (userId === receiverId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot send message to yourself'
        });
      }
      
      const message = await MessageService.create(userId, receiverId, {
        content,
        attachments
      });
      
      return res.status(201).json({
        success: true,
        data: message
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getConversation(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { userId: otherUserId } = req.params;
      
      const conversation = await MessageService.getConversation(userId, otherUserId);
      
      return res.status(200).json({
        success: true,
        data: conversation
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getConversations(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      
      const conversations = await MessageService.getConversations(userId);
      
      return res.status(200).json({
        success: true,
        data: conversations
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
      
      const message = await MessageService.getById(id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }
      
      // Only the receiver can mark a message as read
      if (message.receiverId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Only the receiver can mark a message as read'
        });
      }
      
      const updatedMessage = await MessageService.markAsRead(id);
      
      return res.status(200).json({
        success: true,
        data: updatedMessage
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
      
      const message = await MessageService.getById(id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }
      
      // Check if user is the sender or receiver
      if (message.senderId.toString() !== userId && message.receiverId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this message'
        });
      }
      
      await MessageService.delete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default MessageController; 
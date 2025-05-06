import { Request, Response } from 'express';
import PaymentService from '../services/paymentService';
import { PaymentType } from '../models/Payment';

// Extended Request interface to include user
interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

interface PaymentBody {
  amount: number;
  type: PaymentType;
  description: string;
  serviceId?: string;
  projectId?: string;
  paymentMethod?: string;
  paymentDetails?: any;
}

interface WithdrawalBody {
  amount: number;
}

class PaymentController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const payments = await PaymentService.getAll(userId);
      
      return res.status(200).json({
        success: true,
        data: payments
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
      const payment = await PaymentService.getById(id);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Check if user is authorized to access this payment
      if (payment.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this payment'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: payment
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
      const paymentData: PaymentBody = req.body;
      
      // Validation
      if (!paymentData.amount || !paymentData.type || !paymentData.description) {
        return res.status(400).json({
          success: false,
          message: 'Amount, type and description are required'
        });
      }
      
      const payment = await PaymentService.create(userId, paymentData);
      
      return res.status(201).json({
        success: true,
        data: payment
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async verify(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { transactionId } = req.body;
      
      if (!transactionId) {
        return res.status(400).json({
          success: false,
          message: 'Transaction ID is required'
        });
      }
      
      const payment = await PaymentService.verify(id, transactionId);
      
      return res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const history = await PaymentService.getHistory(userId);
      
      return res.status(200).json({
        success: true,
        data: history
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getEarnings(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const earnings = await PaymentService.getEarnings(userId);
      
      return res.status(200).json({
        success: true,
        data: earnings
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async withdraw(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { amount }: WithdrawalBody = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid amount is required'
        });
      }
      
      const withdrawal = await PaymentService.withdraw(userId, amount);
      
      return res.status(201).json({
        success: true,
        data: withdrawal
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default PaymentController; 
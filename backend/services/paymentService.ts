import Payment, { PaymentStatus, PaymentType, PaymentDocument } from '../models/Payment';
import User from '../models/User';
import { NotificationType } from '../models/Notification';
import NotificationService from './notificationService';
import mongoose from 'mongoose';

interface PaymentInput {
  amount: number;
  type: PaymentType;
  description: string;
  serviceId?: string;
  projectId?: string;
  paymentMethod?: string;
  paymentDetails?: any;
}

class PaymentService {
  static async getAll(userId: string) {
    return Payment.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  static async getById(paymentId: string) {
    return Payment.findById(paymentId).exec();
  }

  static async create(userId: string, data: PaymentInput) {
    const payment = new Payment({
      userId,
      amount: data.amount,
      type: data.type,
      description: data.description,
      serviceId: data.serviceId,
      projectId: data.projectId,
      paymentMethod: data.paymentMethod,
      paymentDetails: data.paymentDetails,
      status: PaymentStatus.PENDING
    });

    const savedPayment = await payment.save();

    // Create notification
    await NotificationService.create({
      userId,
      title: 'Payment Created',
      message: `A ${data.type.toLowerCase()} of $${data.amount} has been created and is pending.`,
      type: NotificationType.PAYMENT,
      relatedId: savedPayment._id
    });

    return savedPayment;
  }

  static async verify(paymentId: string, transactionId: string) {
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: PaymentStatus.COMPLETED,
        transactionId
      },
      { new: true }
    ).exec();

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Create notification
    await NotificationService.create({
      userId: payment.userId.toString(),
      title: 'Payment Completed',
      message: `Your ${payment.type.toLowerCase()} of $${payment.amount} has been completed.`,
      type: NotificationType.PAYMENT,
      relatedId: payment._id
    });

    return payment;
  }

  static async getHistory(userId: string) {
    return Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();
  }

  static async getEarnings(userId: string) {
    // Get total earnings
    const totalEarnings = await Payment.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: PaymentType.PAYMENT,
          status: PaymentStatus.COMPLETED
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get total withdrawals
    const totalWithdrawals = await Payment.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: PaymentType.WITHDRAWAL,
          status: PaymentStatus.COMPLETED
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Monthly earnings for the current year
    const currentYear = new Date().getFullYear();
    const monthlyEarnings = await Payment.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: PaymentType.PAYMENT,
          status: PaymentStatus.COMPLETED,
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          earnings: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Format monthly data for all 12 months
    const monthlyData = Array(12).fill(0);
    monthlyEarnings.forEach((item) => {
      monthlyData[item._id - 1] = item.earnings;
    });

    return {
      totalEarnings: totalEarnings.length > 0 ? totalEarnings[0].total : 0,
      totalWithdrawals: totalWithdrawals.length > 0 ? totalWithdrawals[0].total : 0,
      availableBalance: 
        (totalEarnings.length > 0 ? totalEarnings[0].total : 0) - 
        (totalWithdrawals.length > 0 ? totalWithdrawals[0].total : 0),
      monthlyData
    };
  }

  static async withdraw(userId: string, amount: number) {
    // Check available balance
    const earnings = await this.getEarnings(userId);
    
    if (earnings.availableBalance < amount) {
      throw new Error('Insufficient balance for withdrawal');
    }

    const withdrawal = new Payment({
      userId,
      amount,
      type: PaymentType.WITHDRAWAL,
      description: 'Withdrawal to external account',
      status: PaymentStatus.PENDING
    });

    const savedWithdrawal = await withdrawal.save();

    // Create notification
    await NotificationService.create({
      userId,
      title: 'Withdrawal Requested',
      message: `Your withdrawal request for $${amount} has been received and is being processed.`,
      type: NotificationType.PAYMENT,
      relatedId: savedWithdrawal._id
    });

    return savedWithdrawal;
  }
}

export default PaymentService; 
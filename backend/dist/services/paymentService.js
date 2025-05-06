"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Payment_1 = __importStar(require("../models/Payment"));
const Notification_1 = require("../models/Notification");
const notificationService_1 = __importDefault(require("./notificationService"));
const mongoose_1 = __importDefault(require("mongoose"));
class PaymentService {
    static getAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Payment_1.default.find({ userId }).sort({ createdAt: -1 }).exec();
        });
    }
    static getById(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Payment_1.default.findById(paymentId).exec();
        });
    }
    static create(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = new Payment_1.default({
                userId,
                amount: data.amount,
                type: data.type,
                description: data.description,
                serviceId: data.serviceId,
                projectId: data.projectId,
                paymentMethod: data.paymentMethod,
                paymentDetails: data.paymentDetails,
                status: Payment_1.PaymentStatus.PENDING
            });
            const savedPayment = yield payment.save();
            // Create notification
            yield notificationService_1.default.create({
                userId,
                title: 'Payment Created',
                message: `A ${data.type.toLowerCase()} of $${data.amount} has been created and is pending.`,
                type: Notification_1.NotificationType.PAYMENT,
                relatedId: savedPayment._id
            });
            return savedPayment;
        });
    }
    static verify(paymentId, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield Payment_1.default.findByIdAndUpdate(paymentId, {
                status: Payment_1.PaymentStatus.COMPLETED,
                transactionId
            }, { new: true }).exec();
            if (!payment) {
                throw new Error('Payment not found');
            }
            // Create notification
            yield notificationService_1.default.create({
                userId: payment.userId.toString(),
                title: 'Payment Completed',
                message: `Your ${payment.type.toLowerCase()} of $${payment.amount} has been completed.`,
                type: Notification_1.NotificationType.PAYMENT,
                relatedId: payment._id
            });
            return payment;
        });
    }
    static getHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Payment_1.default.find({ userId })
                .sort({ createdAt: -1 })
                .limit(20)
                .exec();
        });
    }
    static getEarnings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get total earnings
            const totalEarnings = yield Payment_1.default.aggregate([
                {
                    $match: {
                        userId: new mongoose_1.default.Types.ObjectId(userId),
                        type: Payment_1.PaymentType.PAYMENT,
                        status: Payment_1.PaymentStatus.COMPLETED
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
            const totalWithdrawals = yield Payment_1.default.aggregate([
                {
                    $match: {
                        userId: new mongoose_1.default.Types.ObjectId(userId),
                        type: Payment_1.PaymentType.WITHDRAWAL,
                        status: Payment_1.PaymentStatus.COMPLETED
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
            const monthlyEarnings = yield Payment_1.default.aggregate([
                {
                    $match: {
                        userId: new mongoose_1.default.Types.ObjectId(userId),
                        type: Payment_1.PaymentType.PAYMENT,
                        status: Payment_1.PaymentStatus.COMPLETED,
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
                availableBalance: (totalEarnings.length > 0 ? totalEarnings[0].total : 0) -
                    (totalWithdrawals.length > 0 ? totalWithdrawals[0].total : 0),
                monthlyData
            };
        });
    }
    static withdraw(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check available balance
            const earnings = yield this.getEarnings(userId);
            if (earnings.availableBalance < amount) {
                throw new Error('Insufficient balance for withdrawal');
            }
            const withdrawal = new Payment_1.default({
                userId,
                amount,
                type: Payment_1.PaymentType.WITHDRAWAL,
                description: 'Withdrawal to external account',
                status: Payment_1.PaymentStatus.PENDING
            });
            const savedWithdrawal = yield withdrawal.save();
            // Create notification
            yield notificationService_1.default.create({
                userId,
                title: 'Withdrawal Requested',
                message: `Your withdrawal request for $${amount} has been received and is being processed.`,
                type: Notification_1.NotificationType.PAYMENT,
                relatedId: savedWithdrawal._id
            });
            return savedWithdrawal;
        });
    }
}
exports.default = PaymentService;

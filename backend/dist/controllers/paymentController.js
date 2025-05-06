"use strict";
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
const paymentService_1 = __importDefault(require("../services/paymentService"));
class PaymentController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const payments = yield paymentService_1.default.getAll(userId);
                return res.status(200).json({
                    success: true,
                    data: payments
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const payment = yield paymentService_1.default.getById(id);
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
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const paymentData = req.body;
                // Validation
                if (!paymentData.amount || !paymentData.type || !paymentData.description) {
                    return res.status(400).json({
                        success: false,
                        message: 'Amount, type and description are required'
                    });
                }
                const payment = yield paymentService_1.default.create(userId, paymentData);
                return res.status(201).json({
                    success: true,
                    data: payment
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { transactionId } = req.body;
                if (!transactionId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Transaction ID is required'
                    });
                }
                const payment = yield paymentService_1.default.verify(id, transactionId);
                return res.status(200).json({
                    success: true,
                    data: payment
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static getHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const history = yield paymentService_1.default.getHistory(userId);
                return res.status(200).json({
                    success: true,
                    data: history
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static getEarnings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const earnings = yield paymentService_1.default.getEarnings(userId);
                return res.status(200).json({
                    success: true,
                    data: earnings
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static withdraw(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { amount } = req.body;
                if (!amount || amount <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Valid amount is required'
                    });
                }
                const withdrawal = yield paymentService_1.default.withdraw(userId, amount);
                return res.status(201).json({
                    success: true,
                    data: withdrawal
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
}
exports.default = PaymentController;

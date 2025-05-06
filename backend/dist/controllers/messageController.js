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
const messageService_1 = __importDefault(require("../services/messageService"));
class MessageController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const messages = yield messageService_1.default.getAll(userId);
                return res.status(200).json({
                    success: true,
                    data: messages
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
                const message = yield messageService_1.default.getById(id);
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
                const { content, receiverId, attachments } = req.body;
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
                const message = yield messageService_1.default.create(userId, receiverId, {
                    content,
                    attachments
                });
                return res.status(201).json({
                    success: true,
                    data: message
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
    static getConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { userId: otherUserId } = req.params;
                const conversation = yield messageService_1.default.getConversation(userId, otherUserId);
                return res.status(200).json({
                    success: true,
                    data: conversation
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
    static getConversations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const conversations = yield messageService_1.default.getConversations(userId);
                return res.status(200).json({
                    success: true,
                    data: conversations
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
    static markAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const message = yield messageService_1.default.getById(id);
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
                const updatedMessage = yield messageService_1.default.markAsRead(id);
                return res.status(200).json({
                    success: true,
                    data: updatedMessage
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
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const message = yield messageService_1.default.getById(id);
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
                yield messageService_1.default.delete(id);
                return res.status(200).json({
                    success: true,
                    message: 'Message deleted successfully'
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
exports.default = MessageController;

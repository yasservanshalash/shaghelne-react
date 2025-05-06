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
const notificationService_1 = __importDefault(require("../services/notificationService"));
class NotificationController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const notifications = yield notificationService_1.default.getAll(userId);
                return res.status(200).json({
                    success: true,
                    data: notifications
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
                const notification = yield notificationService_1.default.getById(id);
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
                const data = req.body;
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
                const notification = yield notificationService_1.default.create(data);
                return res.status(201).json({
                    success: true,
                    data: notification
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
                const notification = yield notificationService_1.default.getById(id);
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
                const updatedNotification = yield notificationService_1.default.markAsRead(id);
                return res.status(200).json({
                    success: true,
                    data: updatedNotification
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
    static markAllAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                yield notificationService_1.default.markAllAsRead(userId);
                return res.status(200).json({
                    success: true,
                    message: 'All notifications marked as read'
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
                const notification = yield notificationService_1.default.getById(id);
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
                yield notificationService_1.default.delete(id);
                return res.status(200).json({
                    success: true,
                    message: 'Notification deleted successfully'
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
exports.default = NotificationController;

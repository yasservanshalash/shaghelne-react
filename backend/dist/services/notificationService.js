"use strict";
// This is a simple notification service for our backend
// In a real application, you might connect to a notification system or database table
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
const Notification_1 = __importDefault(require("../models/Notification"));
class NotificationService {
    static getAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Notification_1.default.find({ userId })
                .sort({ createdAt: -1 })
                .exec();
        });
    }
    static getById(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield Notification_1.default.findById(notificationId).exec();
            if (!notification) {
                throw new Error('Notification not found');
            }
            return notification;
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newNotification = new Notification_1.default({
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type,
                read: data.read || false,
                link: data.link,
                relatedId: data.relatedId
            });
            return newNotification.save();
        });
    }
    static markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield Notification_1.default.findByIdAndUpdate(notificationId, { read: true }, { new: true }).exec();
            if (!notification) {
                throw new Error('Notification not found');
            }
            return notification;
        });
    }
    static markAllAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Notification_1.default.updateMany({ userId, read: false }, { read: true }).exec();
            return {
                message: `Marked ${result.modifiedCount} notifications as read`,
                count: result.modifiedCount
            };
        });
    }
    static delete(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield Notification_1.default.findByIdAndDelete(notificationId).exec();
            if (!notification) {
                throw new Error('Notification not found');
            }
            return { message: 'Notification deleted successfully' };
        });
    }
}
exports.default = NotificationService;

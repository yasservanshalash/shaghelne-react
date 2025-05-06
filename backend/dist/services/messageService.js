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
const Message_1 = __importDefault(require("../models/Message"));
const mongoose_1 = __importDefault(require("mongoose"));
const Notification_1 = require("../models/Notification");
const notificationService_1 = __importDefault(require("./notificationService"));
class MessageService {
    static getAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Message_1.default.find({
                $or: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            })
                .sort({ createdAt: -1 })
                .exec();
        });
    }
    static getById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Message_1.default.findById(messageId).exec();
        });
    }
    static create(senderId, receiverId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = new Message_1.default({
                content: data.content,
                senderId,
                receiverId,
                attachments: data.attachments || []
            });
            const savedMessage = yield message.save();
            // Create notification for receiver
            yield notificationService_1.default.create({
                userId: receiverId,
                title: 'New Message',
                message: 'You have received a new message',
                type: Notification_1.NotificationType.MESSAGE,
                relatedId: savedMessage._id
            });
            return savedMessage;
        });
    }
    static getConversation(userId1, userId2) {
        return __awaiter(this, void 0, void 0, function* () {
            return Message_1.default.find({
                $or: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 }
                ]
            })
                .sort({ createdAt: 1 })
                .exec();
        });
    }
    static getConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Aggregate to get the latest message from each conversation
            const conversations = yield Message_1.default.aggregate([
                {
                    $match: {
                        $or: [
                            { senderId: new mongoose_1.default.Types.ObjectId(userId) },
                            { receiverId: new mongoose_1.default.Types.ObjectId(userId) }
                        ]
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $eq: ['$senderId', new mongoose_1.default.Types.ObjectId(userId)] },
                                '$receiverId',
                                '$senderId'
                            ]
                        },
                        lastMessage: { $first: '$$ROOT' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        _id: 1,
                        lastMessage: 1,
                        user: {
                            _id: 1,
                            name: 1,
                            profileImage: 1
                        }
                    }
                }
            ]);
            return conversations;
        });
    }
    static markAsRead(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Message_1.default.findByIdAndUpdate(messageId, { read: true }, { new: true }).exec();
        });
    }
    static delete(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Message_1.default.findByIdAndDelete(messageId).exec();
        });
    }
}
exports.default = MessageService;

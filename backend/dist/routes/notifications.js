"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = __importDefault(require("../controllers/notificationController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All notification routes require authentication
router.use(auth_1.verifyToken);
// Get all notifications for the current user
router.get('/', notificationController_1.default.getAll);
// Create a new notification
router.post('/', notificationController_1.default.create);
// Mark all notifications as read
router.put('/read-all', notificationController_1.default.markAllAsRead);
// Get a specific notification by ID
router.get('/:id', notificationController_1.default.getById);
// Mark a notification as read
router.put('/:id/read', notificationController_1.default.markAsRead);
// Delete a notification
router.delete('/:id', notificationController_1.default.delete);
exports.default = router;

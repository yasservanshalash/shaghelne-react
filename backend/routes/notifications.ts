import express from 'express';
import NotificationController from '../controllers/notificationController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// All notification routes require authentication
router.use(verifyToken);

// Get all notifications for the current user
router.get('/', NotificationController.getAll);

// Create a new notification
router.post('/', NotificationController.create);

// Mark all notifications as read
router.put('/read-all', NotificationController.markAllAsRead);

// Get a specific notification by ID
router.get('/:id', NotificationController.getById);

// Mark a notification as read
router.put('/:id/read', NotificationController.markAsRead);

// Delete a notification
router.delete('/:id', NotificationController.delete);

export default router; 
import express from 'express';
import MessageController from '../controllers/messageController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// All message routes require authentication
router.use(verifyToken);

// Get all messages for the current user
router.get('/', MessageController.getAll);

// Get all conversations for the current user
router.get('/conversations', MessageController.getConversations);

// Get a specific conversation with another user
router.get('/conversation/:userId', MessageController.getConversation);

// Send a new message
router.post('/', MessageController.create);

// Get a specific message by ID
router.get('/:id', MessageController.getById);

// Mark a message as read
router.put('/:id/read', MessageController.markAsRead);

// Delete a message
router.delete('/:id', MessageController.delete);

export default router; 
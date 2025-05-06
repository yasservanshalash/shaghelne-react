import express from 'express';
import PaymentController from '../controllers/paymentController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// All payment routes require authentication
router.use(verifyToken);

// Get all payments for the current user
router.get('/', PaymentController.getAll);

// Get payment history
router.get('/history', PaymentController.getHistory);

// Get earnings data (for freelancers)
router.get('/earnings', PaymentController.getEarnings);

// Process a withdrawal
router.post('/withdraw', PaymentController.withdraw);

// Create a new payment
router.post('/', PaymentController.create);

// Get a specific payment by ID
router.get('/:id', PaymentController.getById);

// Verify a payment
router.put('/:id/verify', PaymentController.verify);

export default router; 
import express from 'express';
import CategoryController from '../controllers/categoryController';
import { verifyToken, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes - no auth needed
router.get('/', CategoryController.getAll);
router.get('/search', CategoryController.search);
router.get('/:id', CategoryController.getById);
router.get('/:id/subcategories', CategoryController.getSubcategories);

// Admin routes - require auth and admin role
router.post('/', verifyToken, authorizeAdmin, CategoryController.create);
router.put('/:id', verifyToken, authorizeAdmin, CategoryController.update);
router.delete('/:id', verifyToken, authorizeAdmin, CategoryController.delete);

export default router; 
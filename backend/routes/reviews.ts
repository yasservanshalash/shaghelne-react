import { Router } from "express";
import ReviewController from "../controllers/reviewController";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Get all reviews with optional filtering
router.get("/", ReviewController.getAll);

// Get review by ID
router.get("/:id", ReviewController.getById);

// Create new review (requires authentication)
router.post("/", verifyToken, ReviewController.create);

// Update review (requires authentication and ownership)
router.put("/:id", verifyToken, ReviewController.update);

// Delete review (requires authentication and ownership)
router.delete("/:id", verifyToken, ReviewController.delete);

// Get reviews by service ID
router.get("/service/:serviceId", ReviewController.getByService);

// Get reviews by user ID
router.get("/user/:userId", ReviewController.getByUser);

export default router; 
import { Router } from "express";
import JobApplicationController from "../controllers/jobApplicationController";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Get all applications with optional filtering (admin only)
router.get("/", verifyToken, JobApplicationController.getAll);

// Get application by ID
router.get("/:id", verifyToken, JobApplicationController.getById);

// Create new application (requires authentication)
router.post("/", verifyToken, JobApplicationController.create);

// Update application (requires authentication and ownership)
router.put("/:id", verifyToken, JobApplicationController.update);

// Withdraw application (requires authentication and ownership)
router.post("/:id/withdraw", verifyToken, JobApplicationController.withdraw);

// Get applications of authenticated user
router.get("/user/me", verifyToken, JobApplicationController.getByUser);

// Approve application (requires authentication and job ownership)
router.post("/:id/approve", verifyToken, JobApplicationController.approve);

// Reject application (requires authentication and job ownership)
router.post("/:id/reject", verifyToken, JobApplicationController.reject);

export default router; 
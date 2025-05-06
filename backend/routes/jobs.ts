import { Router } from "express";
import JobController from "../controllers/jobController";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Get all jobs with optional filtering
router.get("/", JobController.getAll);

// Get job by ID
router.get("/:id", JobController.getById);

// Create new job (requires authentication)
router.post("/", verifyToken, JobController.create);

// Update job (requires authentication)
router.put("/:id", verifyToken, JobController.update);

// Delete job (requires authentication)
router.delete("/:id", verifyToken, JobController.delete);

// Get jobs by user ID
router.get("/user/:userId", JobController.getByUser);

// Search jobs
router.get("/search/query", JobController.search);

// Get job applications (requires authentication and ownership)
router.get("/:id/applications", verifyToken, JobController.getApplications);

export default router; 
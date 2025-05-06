import { Router } from "express";
import ProjectController from "../controllers/projectController";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Get all projects with optional filtering
router.get("/", ProjectController.getAll);

// Get project by ID
router.get("/:id", ProjectController.getById);

// Create new project (requires authentication)
router.post("/", verifyToken, ProjectController.create);

// Update project (requires authentication)
router.put("/:id", verifyToken, ProjectController.update);

// Delete project (requires authentication)
router.delete("/:id", verifyToken, ProjectController.delete);

// Get projects by user ID
router.get("/user/:userId", ProjectController.getByUser);

// Search projects
router.get("/search/query", ProjectController.search);

// Get project proposals (requires authentication and ownership)
router.get("/:id/proposals", verifyToken, ProjectController.getProposals);

export default router; 
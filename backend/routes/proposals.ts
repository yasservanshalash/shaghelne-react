import { Router } from "express";
import ProposalController from "../controllers/proposalController";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Get all proposals with optional filtering (admin only)
router.get("/", verifyToken, ProposalController.getAll);

// Get proposal by ID
router.get("/:id", verifyToken, ProposalController.getById);

// Create new proposal (requires authentication)
router.post("/", verifyToken, ProposalController.create);

// Update proposal (requires authentication and ownership)
router.put("/:id", verifyToken, ProposalController.update);

// Withdraw proposal (requires authentication and ownership)
router.post("/:id/withdraw", verifyToken, ProposalController.withdraw);

// Get proposals of authenticated user
router.get("/user/me", verifyToken, ProposalController.getByUser);

// Get proposals for a project (requires authentication and project ownership)
router.get("/project/:projectId", verifyToken, ProposalController.getByProject);

// Approve proposal (requires authentication and project ownership)
router.post("/:id/approve", verifyToken, ProposalController.approve);

// Reject proposal (requires authentication and project ownership)
router.post("/:id/reject", verifyToken, ProposalController.reject);

export default router; 
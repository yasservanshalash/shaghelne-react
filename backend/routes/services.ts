import { Router } from "express";
import ServiceController from "../controllers/serviceController";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Get all services with optional filtering
router.get("/", ServiceController.getAll);

// Get service by ID
router.get("/:id", ServiceController.getById);

// Create new service (requires authentication)
router.post("/", verifyToken, ServiceController.create);

// Update service (requires authentication)
router.put("/:id", verifyToken, ServiceController.update);

// Delete service (requires authentication)
router.delete("/:id", verifyToken, ServiceController.delete);

// Get services by user ID
router.get("/user/:userId", ServiceController.getByUser);

// Upload service image (requires authentication)
router.post("/:id/image", verifyToken, ServiceController.uploadImage);

// Search services
router.get("/search/query", ServiceController.search);

export default router; 
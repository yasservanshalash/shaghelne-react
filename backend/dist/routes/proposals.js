"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proposalController_1 = __importDefault(require("../controllers/proposalController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all proposals with optional filtering (admin only)
router.get("/", auth_1.verifyToken, proposalController_1.default.getAll);
// Get proposal by ID
router.get("/:id", auth_1.verifyToken, proposalController_1.default.getById);
// Create new proposal (requires authentication)
router.post("/", auth_1.verifyToken, proposalController_1.default.create);
// Update proposal (requires authentication and ownership)
router.put("/:id", auth_1.verifyToken, proposalController_1.default.update);
// Withdraw proposal (requires authentication and ownership)
router.post("/:id/withdraw", auth_1.verifyToken, proposalController_1.default.withdraw);
// Get proposals of authenticated user
router.get("/user/me", auth_1.verifyToken, proposalController_1.default.getByUser);
// Get proposals for a project (requires authentication and project ownership)
router.get("/project/:projectId", auth_1.verifyToken, proposalController_1.default.getByProject);
// Approve proposal (requires authentication and project ownership)
router.post("/:id/approve", auth_1.verifyToken, proposalController_1.default.approve);
// Reject proposal (requires authentication and project ownership)
router.post("/:id/reject", auth_1.verifyToken, proposalController_1.default.reject);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobApplicationController_1 = __importDefault(require("../controllers/jobApplicationController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all applications with optional filtering (admin only)
router.get("/", auth_1.verifyToken, jobApplicationController_1.default.getAll);
// Get application by ID
router.get("/:id", auth_1.verifyToken, jobApplicationController_1.default.getById);
// Create new application (requires authentication)
router.post("/", auth_1.verifyToken, jobApplicationController_1.default.create);
// Update application (requires authentication and ownership)
router.put("/:id", auth_1.verifyToken, jobApplicationController_1.default.update);
// Withdraw application (requires authentication and ownership)
router.post("/:id/withdraw", auth_1.verifyToken, jobApplicationController_1.default.withdraw);
// Get applications of authenticated user
router.get("/user/me", auth_1.verifyToken, jobApplicationController_1.default.getByUser);
// Approve application (requires authentication and job ownership)
router.post("/:id/approve", auth_1.verifyToken, jobApplicationController_1.default.approve);
// Reject application (requires authentication and job ownership)
router.post("/:id/reject", auth_1.verifyToken, jobApplicationController_1.default.reject);
exports.default = router;

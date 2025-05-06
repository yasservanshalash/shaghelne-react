"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = __importDefault(require("../controllers/jobController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all jobs with optional filtering
router.get("/", jobController_1.default.getAll);
// Get job by ID
router.get("/:id", jobController_1.default.getById);
// Create new job (requires authentication)
router.post("/", auth_1.verifyToken, jobController_1.default.create);
// Update job (requires authentication)
router.put("/:id", auth_1.verifyToken, jobController_1.default.update);
// Delete job (requires authentication)
router.delete("/:id", auth_1.verifyToken, jobController_1.default.delete);
// Get jobs by user ID
router.get("/user/:userId", jobController_1.default.getByUser);
// Search jobs
router.get("/search/query", jobController_1.default.search);
// Get job applications (requires authentication and ownership)
router.get("/:id/applications", auth_1.verifyToken, jobController_1.default.getApplications);
exports.default = router;

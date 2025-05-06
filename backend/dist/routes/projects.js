"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = __importDefault(require("../controllers/projectController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all projects with optional filtering
router.get("/", projectController_1.default.getAll);
// Get project by ID
router.get("/:id", projectController_1.default.getById);
// Create new project (requires authentication)
router.post("/", auth_1.verifyToken, projectController_1.default.create);
// Update project (requires authentication)
router.put("/:id", auth_1.verifyToken, projectController_1.default.update);
// Delete project (requires authentication)
router.delete("/:id", auth_1.verifyToken, projectController_1.default.delete);
// Get projects by user ID
router.get("/user/:userId", projectController_1.default.getByUser);
// Search projects
router.get("/search/query", projectController_1.default.search);
// Get project proposals (requires authentication and ownership)
router.get("/:id/proposals", auth_1.verifyToken, projectController_1.default.getProposals);
exports.default = router;

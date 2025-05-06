"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = __importDefault(require("../controllers/serviceController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all services with optional filtering
router.get("/", serviceController_1.default.getAll);
// Get service by ID
router.get("/:id", serviceController_1.default.getById);
// Create new service (requires authentication)
router.post("/", auth_1.verifyToken, serviceController_1.default.create);
// Update service (requires authentication)
router.put("/:id", auth_1.verifyToken, serviceController_1.default.update);
// Delete service (requires authentication)
router.delete("/:id", auth_1.verifyToken, serviceController_1.default.delete);
// Get services by user ID
router.get("/user/:userId", serviceController_1.default.getByUser);
// Upload service image (requires authentication)
router.post("/:id/image", auth_1.verifyToken, serviceController_1.default.uploadImage);
// Search services
router.get("/search/query", serviceController_1.default.search);
exports.default = router;

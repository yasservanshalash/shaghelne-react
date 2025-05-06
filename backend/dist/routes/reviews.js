"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = __importDefault(require("../controllers/reviewController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all reviews with optional filtering
router.get("/", reviewController_1.default.getAll);
// Get review by ID
router.get("/:id", reviewController_1.default.getById);
// Create new review (requires authentication)
router.post("/", auth_1.verifyToken, reviewController_1.default.create);
// Update review (requires authentication and ownership)
router.put("/:id", auth_1.verifyToken, reviewController_1.default.update);
// Delete review (requires authentication and ownership)
router.delete("/:id", auth_1.verifyToken, reviewController_1.default.delete);
// Get reviews by service ID
router.get("/service/:serviceId", reviewController_1.default.getByService);
// Get reviews by user ID
router.get("/user/:userId", reviewController_1.default.getByUser);
exports.default = router;

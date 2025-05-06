"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all users (admin only)
router.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Implementation will be added later
    res.json({ message: "Get all users endpoint" });
}));
// Get user profile
router.get("/profile", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Implementation will be added later
    res.json({ message: "Get user profile endpoint" });
}));
// Get user by ID
router.get("/:id", userController_1.default.getUserById);
// Get authenticated user's profile
router.get("/profile/me", auth_1.verifyToken, userController_1.default.getProfile);
// Update authenticated user's profile
router.put("/profile", auth_1.verifyToken, userController_1.default.updateProfile);
// Upload profile image
router.post("/profile/image", auth_1.verifyToken, userController_1.default.uploadProfileImage);
// Search users
router.get("/search/query", userController_1.default.searchUsers);
// Get all freelancers
router.get("/freelancers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Implementation will be added later
    res.json({ message: "Get all freelancers endpoint" });
}));
// Get user's portfolio
router.get("/:userId/portfolio", userController_1.default.getPortfolio);
// Update authenticated user's portfolio
router.put("/portfolio", auth_1.verifyToken, userController_1.default.updatePortfolio);
// Get freelancers with filtering options
router.get("/freelancers/all", userController_1.default.getFreelancers);
exports.default = router;

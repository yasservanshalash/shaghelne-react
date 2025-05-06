"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Register user
router.post("/register", authController_1.default.register);
// Login user
router.post("/login", authController_1.default.login);
// Logout user
router.post("/logout", authController_1.default.logout);
// Update profile
router.put("/profile", auth_1.verifyToken, authController_1.default.updateProfile);
// Change password
router.post("/change-password", auth_1.verifyToken, authController_1.default.changePassword);
// Forgot password
router.post("/forgot-password", authController_1.default.forgotPassword);
// Reset password
router.post("/reset-password", authController_1.default.resetPassword);
// Verify email
router.post("/verify-email", authController_1.default.verifyEmail);
exports.default = router;

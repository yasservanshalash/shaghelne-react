import { Router } from "express";
import AuthController from "../controllers/authController";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Register user
router.post("/register", AuthController.register);

// Login user
router.post("/login", AuthController.login);

// Logout user
router.post("/logout", AuthController.logout);

// Update profile
router.put("/profile", verifyToken, AuthController.updateProfile);

// Change password
router.post("/change-password", verifyToken, AuthController.changePassword);

// Forgot password
router.post("/forgot-password", AuthController.forgotPassword);

// Reset password
router.post("/reset-password", AuthController.resetPassword);

// Verify email
router.post("/verify-email", AuthController.verifyEmail);

export default router; 
import { Router } from "express";
import UserController from "../controllers/userController";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Get all users (admin only)
router.get("/", verifyToken, async (req, res) => {
  // Implementation will be added later
  res.json({ message: "Get all users endpoint" });
});

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  // Implementation will be added later
  res.json({ message: "Get user profile endpoint" });
});

// Get user by ID
router.get("/:id", UserController.getUserById);

// Get authenticated user's profile
router.get("/profile/me", verifyToken, UserController.getProfile);

// Update authenticated user's profile
router.put("/profile", verifyToken, UserController.updateProfile);

// Upload profile image
router.post("/profile/image", verifyToken, UserController.uploadProfileImage);

// Search users
router.get("/search/query", UserController.searchUsers);

// Get all freelancers
router.get("/freelancers", async (req, res) => {
  // Implementation will be added later
  res.json({ message: "Get all freelancers endpoint" });
});

// Get user's portfolio
router.get("/:userId/portfolio", UserController.getPortfolio);

// Update authenticated user's portfolio
router.put("/portfolio", verifyToken, UserController.updatePortfolio);

// Get freelancers with filtering options
router.get("/freelancers/all", UserController.getFreelancers);

export default router; 
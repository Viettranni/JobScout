const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/adminUserControllers");
const userController = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");

// Unprotected Register and Login routes for all
router.post("/register", userController.registerUser); // Registers new user
router.post("/login", userController.loginUser); // Login user

// Protected user routes
router.get("/profile", authMiddleware, userController.getUserById); // Get current user's profile (no :id needed)
router.patch("/profile", authMiddleware, userController.updateUser); // Update current user's profile (no :id needed)
router.delete("/profile", authMiddleware, userController.deleteUser); // Delete current user's account (no :id needed)

router.post("/favourites", authMiddleware, userController.addToFavourites); // Add job to current user's favourites
router.delete(
  "/favourites",
  authMiddleware,
  userController.removeFromFavourites
); // Remove job from current user's favourites

// Fetch all saved jobs (favourites) for the authenticated user
router.get("/favourites", authMiddleware, userController.getUserWithFavourites);

module.exports = router;

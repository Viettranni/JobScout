const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/adminUserControllers");
const userController = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Unprotected Register and Login routes for all
router.post("/register", userController.registerUser); // Registers new user
router.post("/login", userController.loginUser); // Login user

// Protected user routes
router.get("/profile", authMiddleware, userController.getUserById); // Get current user's profile (no :id needed)
router.patch("/profile", authMiddleware, userController.updateUser); // Update current user's profile (no :id needed)
router.delete("/profile", authMiddleware, userController.deleteUser); // Delete current user's account (no :id needed)

router.patch("/favourites", authMiddleware, userController.addToFavourites); // Add job to current user's favourites
router.delete(
  "/favourites",
  authMiddleware,
  userController.removeFromFavourites
); // Remove job from current user's favourites

// Fetch all saved jobs (favourites) for the authenticated user
router.get("/favourites", authMiddleware, userController.getUserWithFavourites);

router.post("/userData", authMiddleware, userController.userData);

// Avatar upload route
router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  userController.uploadAvatar
);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const authRouter = require("../routes/authRouter");

// Routes for user management
router.get("/allUsers", userController.getAllUsers);
router.get("/:id", userController.getUserById); // Get a user by ID
router.patch("/:id", userController.updateUser); // Update user details
router.delete("/delete/:id", userController.deleteUser); // Delete a user
router.post("/:id/favourites/:jobPostId", userController.addToFavourites); // Add job to user's favourites
router.delete(
  "/:id/favourites/:jobPostId",
  userController.removeFromFavourites
); // Route to remove a job post from user's favourites

// Auth routes
router.post("/register", authRouter.registerUser); // Registers new user
router.post("/login", authRouter.loginUser); // Login user

module.exports = router;

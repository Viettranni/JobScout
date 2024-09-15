const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

// Routes for user management
router.get("/users", userController.getAllUsers);
router.post("/users", userController.createUser);
router.get("/users/:id", userController.getUserById); // Get a user by ID
router.patch("/users/:id", userController.updateUser); // Update user details
router.delete("/users/:id", userController.deleteUser); // Delete a user
router.post("/users/:id/favourites/:jobPostId", userController.addToFavourites); // Add job to user's favourites
router.delete(
  "/users/:id/favourites/:jobPostId",
  userController.removeFromFavourites
); // Route to remove a job post from user's favourites

module.exports = router;

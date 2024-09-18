const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

// Routes for user management
router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getUserById); // Get a user by ID
router.patch("/:id", userController.updateUser); // Update user details
router.delete("/:id", userController.deleteUser); // Delete a user
router.post("/:id/favourites/:jobPostId", userController.addToFavourites); // Add job to user's favourites
router.delete(
  "/:id/favourites/:jobPostId",
  userController.removeFromFavourites
); // Route to remove a job post from user's favourites

module.exports = router;

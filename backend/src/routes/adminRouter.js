const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/adminUserControllers");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Protected admin routes for user management
router.get(
  "/allUsers",
  authMiddleware,
  roleMiddleware("admin"),
  adminUserController.getAllUsers
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminUserController.getUserById
); // Get a user by ID
router.post(
  "/createUser",
  authMiddleware,
  roleMiddleware("admin"),
  adminUserController.createUser
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminUserController.updateUser
); // Update user details
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminUserController.deleteUser
); // Delete a user
router.post(
  "/:id/favourites/:jobPostId",
  authMiddleware,
  roleMiddleware("admin"),
  adminUserController.addToFavourites
); // Add job to user's favourites
router.delete(
  "/:id/favourites/:jobPostId",
  authMiddleware,
  roleMiddleware("admin"),
  adminUserController.removeFromFavourites
); // Route to remove a job post from user's favourites
router.get(
  "/favourites",
  authMiddleware,
  roleMiddleware("admin"),
  adminUserController.getUserWithFavourites
); // Fetch all saved jobs (favourites) for the authenticated user

module.exports = router;

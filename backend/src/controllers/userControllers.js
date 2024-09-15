const User = require("../models/User");
const mongoose = require("mongoose");

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .populate("favourites"); // Populate favourites with job post data
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id).populate("favourites");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve user", error: err.message });
  }
};

// POST Create a new user
exports.createUser = async (req, res) => {
  const user = new User({ ...req.body });

  try {
    const newUser = await user.save(); // Corrected to use instance's save method
    res.status(201).json(newUser);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create user", error: err.message });
  }
};

// PATCH Update a user by ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.password) {
      // Hash new password if provided
      user.password = req.body.password;
      await user.save(); // Save before hashing
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update user", error: err.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const deletedUser = await User.findOneAndDelete({ _id: id });
    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

// Add job to user's favourites
exports.addToFavourites = async (req, res) => {
  const { id, jobPostId } = req.params; // User ID from URL

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the job ID already exists in favourites
    if (user.favourites.includes(jobPostId)) {
      return res.status(400).json({ message: "Job already in favourites" });
    }

    // Add the job ID to favourites array
    user.favourites.push(jobPostId);
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove a job post from favourites
exports.removeFromFavourites = async (req, res) => {
  const { id, jobPostId } = req.params; // Get id and jobPostId from URL params

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure favourites is an array of objects
    if (!Array.isArray(user.favourites)) {
      return res
        .status(500)
        .json({ message: "User favourites should be an array" });
    }

    // Remove job post from favourites array
    user.favourites = user.favourites.filter(
      (jobPost) => jobPost._id.toString() !== jobPostId.toString()
    );

    // Save the updated user document
    await user.save();

    // Optionally, repopulate the user document with job posts for a detailed response
    const updatedUser = await User.findById(id).populate("favourites");
    res.json(updatedUser);
  } catch (err) {
    console.error("Error removing from favourites:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get user's favourites
exports.getUserWithFavourites = async (req, res) => {
  const { id } = req.params; // User ID from URL

  try {
    const user = await User.findById(id).populate("favourites");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favourites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// GET/ user by token id
exports.getUserById = async (req, res) => {
  // Ensure req.user exists after authMiddleware
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Invalid user or user not authenticated" });
  }
  const userId = req.user.id; // Extracted from JWT

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId)
      .populate("favourites") // Populate with necessary relations
      .select("-password"); // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only the necessary fields
    const { _id, firstname, lastname, email, favourites, role } = user;
    res
      .status(200)
      .json({ id: _id, firstname, lastname, email, favourites, role });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve user", error: err.message });
  }
};

// POST / create user
exports.createUser = async (req, res) => {
  const user = new User({ ...req.body });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create user", error: err.message });
  }
};

// PATCH/ update user
exports.updateUser = async (req, res) => {
  // Ensure req.user exists after authMiddleware
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Invalid user or user not authenticated" });
  }
  const userId = req.user.id; // Extracted from JWT

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Return only the necessary fields
    const { _id, firstname, lastname, email } = user;
    res.status(200).json({ id: _id, firstname, lastname, email });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update user", error: err.message });
  }
};

// DELETE/ user by id
exports.deleteUser = async (req, res) => {
  // Ensure req.user exists after authMiddleware
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Invalid user or user not authenticated" });
  }
  const userId = req.user.id; // Extracted from JWT

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      res.status(204).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

// POST/ add favourites to user
exports.addToFavourites = async (req, res) => {
  // Ensure req.user exists after authMiddleware
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Invalid user or user not authenticated" });
  }
  const userId = req.user.id; // Extracted from JWT
  const { jobPostId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(jobPostId)) {
    return res.status(400).json({ message: "Invalid job post ID" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.favourites.includes(jobPostId)) {
      return res.status(400).json({ message: "Job already in favourites" });
    }

    user.favourites.push(jobPostId);
    await user.save();

    res.status(200).json(user.favourites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE/ delete favourites from user
exports.removeFromFavourites = async (req, res) => {
  // Ensure req.user exists after authMiddleware
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Invalid user or user not authenticated" });
  }
  const userId = req.user.id; // Extracted from JWT
  const { jobPostId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(jobPostId)
  ) {
    return res.status(400).json({ message: "Invalid user ID or jobPostId" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favourites = user.favourites.filter(
      (jobPost) => jobPost.toString() !== jobPostId
    );

    await user.save();
    res.status(200).json(user.favourites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET/ return only user's favourites with pagination support
exports.getUserWithFavourites = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Invalid user or user not authenticated" });
  }

  const userId = req.user.id;

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Fetch the total number of favorite jobs
    const user = await User.findById(userId).populate("favourites");

    if (!user) return res.status(404).json({ message: "User not found" });

    const totalFavourites = user.favourites.length;

    // Fetch paginated favourites
    const paginatedFavorites = await User.findById(userId)
      .populate({
        path: "favourites",
        options: { skip: skip, limit: parseInt(limit) },
      })
      .lean();

    res.status(200).json({
      favourites: paginatedFavorites.favourites || [],
      totalPages: Math.ceil(totalFavourites / limit),
      totalFavourites,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const newUser = await User.signup(
      firstname,
      lastname,
      email,
      password,
      [],
      []
    );
    const token = jwt.sign(
      { id: newUser._id, firstname: newUser.firstname },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );

    res.status(201).json({ message: "User created successfully!", token }); // Sending the Token to the client
    console.log("New user registered:", newUser.firstname);
  } catch (error) {
    console.error("Error in registerUser:", error.message); // Log error message
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const loggedInUser = await User.login(email, password);
    const token = jwt.sign(
      {
        id: loggedInUser._id,
        firstname: loggedInUser.firstname,
        role: loggedInUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
      firstname: loggedInUser.firstname,
      id: loggedInUser._id,
      role: loggedInUser.role,
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message); // Log error message
    res.status(400).json({ error: error.message });
  }
};

exports.userData = async (req, res) => {
  const { userData } = req.body;

  try {
    // Assuming you have user ID from authentication
    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId);

    console.log(user);

    if (!user) {
      console.log("User hasnt been found");

      return res.status(404).json({ message: "User not found" });
    }

    // Merge existing userData with new data
    user.userData = {
      ...user.userData, // Preserve existing userData
      ...userData, // Update/overwrite with new data
    };

    await user.save(); // Save the updated user document

    return res
      .status(200)
      .json({ message: "User data updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const User = require("../models/User");
const mongoose = require("mongoose");

const addJobPostToFavourites = async (req, res) => {
    const userId = req.body.userId; // Get user ID from request body (or session/token)
    const jobId = String(req.params.jobId);
  
    try {
      // Find user and add job post to their favorites
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Check if job post is already in favorites
      if (user.favourites.includes(jobId)) {
        return res.status(400).json({ message: "Job post already in favorites." });
      }
  
      user.favourites.push(jobId);
      await user.save();
  
      res.status(200).json({ message: "Job post added to favorites!" });
    } catch (error) {
      res.status(500).json({ message: "Server error." });
    }
  };

const removeJobPostFromFavourites = async (req, res) => {
    const userId = req.body.userId; // Get user ID from request body (or session/token)
    const jobId = req.params.jobId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if job is in favorites
        if (!user.favourites.includes(jobId)) {
            return res.status(404).json({ message: "Job is not in the favourites." });
        }
    
        user.favourites.pull(jobId); // Use pull method to remove
        await user.save();

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    addJobPostToFavourites,
    removeJobPostFromFavourites
}
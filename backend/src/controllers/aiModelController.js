const mongoose = require("mongoose");
const User = require("../models/User"); // Import your User model
const { generateCoverLetter } = require("../config/openai");

exports.createCoverLetter = async (req, res) => {
  const { jobData } = req.body;

  if (!jobData) {
    return res.status(400).json({ error: "Job description required" });
  }

  try {
    // Fetch the user data including firstname and lastname
    const user = await User.findById(req.user.id).select('firstname lastname userData'); // Select necessary fields

    if (!user || !user.userData) {
      return res.status(400).json({ message: "User data is not available, please fill it out in the settings." });
    }

    // Extract necessary details from user and userData
    const { firstname, lastname, userData } = user;

    // Pass both userData and jobData to the generateCoverLetter function
    const coverLetter = await generateCoverLetter({ firstname, lastname, ...userData }, jobData);
    
    res.status(200).json({ coverLetter });
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    res.status(500).json({ message: "Error generating cover letter", error: error.message });
  }
};


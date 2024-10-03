const CoverLetter = require("../models/CoverLetter");
const mongoose = require("mongoose");
const { generateCoverLetter } = require("../config/openai");

const createCoverLetter = async (req, res) => {
    const { userData, jobData } = req.body;
  
    if (!userData || !jobData) {
      return res.status(400).json({ error: "User data and job data are required" });
    }
  
    try {
      const coverLetter = await generateCoverLetter(userData, jobData);
      res.json({ coverLetter });
    } catch (error) {
      res.status(500).json({ error: "Error generating cover letter" });
    }
  };

module.exports = { createCoverLetter };

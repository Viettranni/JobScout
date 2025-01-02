const { JobPost } = require("../models/JobPost");
const mongoose = require("mongoose");

exports.getAllJobsMobile = async (req, res) => {
  try {
    const { page = 1, searchTerm, city, logo } = req.query; // Use default page 1 if not provided
    const limit = 832; // Set the limit to 5 jobs only
    const skip = (page - 1) * limit; // Calculate how many jobs to skip
  
    // Build the filter object for MongoDB query
    const filter = {};
  
    // Add searchTerm, city, and logo to the filter if they are provided
    // Validate `searchTerm`
    if (searchTerm && searchTerm.trim() !== "") {
      filter.title = { $regex: searchTerm.trim(), $options: "i" }; // Case-insensitive search for title
    }
  
    // Validate `city`
    if (city && city.trim() !== "") {
      filter.location = { $regex: city.trim(), $options: "i" }; // Case-insensitive search for location (city)
    }
  
    // Validate `logo`
    if (logo && logo.trim() !== "") {
      filter.logo = { $regex: logo.trim(), $options: "i" }; // Case-insensitive search for logo
    }
  
    console.log(filter);
  
    // Execute the query with filtering, pagination, and limit (5 jobs only)
    const jobs = await JobPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit); // Limit the results to 5
  
    const totalJobs = await JobPost.countDocuments(filter); // Get total number of jobs that match the filter
  
    // Return the jobs along with pagination info
    res.status(200).json({
      jobs,
      totalJobs, // Send the total number of jobs for frontend to calculate total pages
      totalPages: Math.ceil(totalJobs / limit), // Calculate total pages
      currentPage: parseInt(page), // Send current page info
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

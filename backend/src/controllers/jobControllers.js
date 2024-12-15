const { JobPost } = require("../models/JobPost");
const mongoose = require("mongoose");

// Get all job posts with search and pagination
exports.getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, searchTerm, city, logo } = req.query; // Use default page 1 and limit 10 if not provided
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

    // Execute the query with filtering, pagination, and limit
    const jobs = await JobPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

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

// Get a single job post by ID
exports.getJobById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const job = await JobPost.findById(id);
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: "Job posting not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Find jobs with search term and city, including pagination
exports.findJobs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const { searchTerm, city } = req.params;
    const query = {};

    if (searchTerm && searchTerm !== "undefined") {
      query.title = { $regex: new RegExp(searchTerm, "i") };
    }

    if (city && city !== "undefined") {
      query.location = { $regex: new RegExp(city, "i") };
    }

    const jobs = await JobPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await JobPost.countDocuments(query); // Count based on search query

    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found matching the criteria" });
    }

    res.status(200).json({
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a job post by ID
exports.deleteJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const jobDeleted = await JobPost.findOneAndDelete({ _id: id });
    if (jobDeleted) {
      res.status(204).json({ message: "job posting deleted successfully" });
    } else {
      res.status(404).json({ message: "Job posting not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete job posting", error: err.message });
  }
};

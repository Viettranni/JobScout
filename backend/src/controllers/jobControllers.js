const { JobPost } = require("../models/JobPost");
const duuniTori = require("../scrapers/duuniTori");
const indeed = require("../scrapers/indeed");
const mongoose = require("mongoose");

// Scrape jobs from the websites
exports.scrapeJobs = async (req, res) => {
  const { city, searchTerm } = req.query;

  try {
    // Run both scrapers concurrently using Promise.all
    await Promise.all([duuniTori(city, searchTerm), indeed(city, searchTerm)]);

    res
      .status(201)
      .send(
        "Job scraping complete for both DuuniTori and Indeed, and data saved."
      );
  } catch (err) {
    console.error("Error in scrapeJobs controller:", err);
    res.status(500).send("Error scraping jobs.");
  }
};

// Scrape jobs from duunitori
exports.scrapeDuuniToriJobs = async (req, res) => {
  const { city, searchTerm } = req.query;
  try {
    await duuniTori(city, searchTerm);
    res.status(201).send("Job scraping complete and data saved.");
  } catch (err) {
    console.error("Error in scrapeJobs controller:", err);
    res.status(500).send("Error scraping jobs.");
  }
};

// Scrape jobs from indeed
exports.scrapeIndeedJobs = async (req, res) => {
  const { city, searchTerm } = req.query;
  try {
    await indeed(city, searchTerm);
    res.status(201).send("Job scraping complete and data saved.");
  } catch (err) {
    console.error("Error in scrapeJobs controller:", err);
    res.status(500).send("Error scraping jobs.");
  }
};

// Get all job posts
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find();
    res.status(200).json(jobs);
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

exports.findJobs = async (req, res) => {
  try {
    const { searchTerm, city } = req.params;

    // Build the query object based on provided parameters
    const query = {};

    // Match the search term with the job title or description fields in your schema
    if (searchTerm && searchTerm !== "undefined") {
      query.title = { $regex: new RegExp(searchTerm, "i") }; // Case-insensitive search on title
    }

    // Match the city with the location field in your schema
    if (city && city !== "undefined") {
      query.location = { $regex: new RegExp(city, "i") }; // Case-insensitive search on location
    }

    // Find jobs based on the query
    const jobs = await JobPost.find(query);

    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found matching the criteria" });
    }

    res.status(200).json(jobs);
  } catch (err) {
    // Log the error for debugging purposes
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
      res.status(404).json({ message: "job posting not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete jon posting", error: err.message });
  }
};

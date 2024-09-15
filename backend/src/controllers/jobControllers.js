const { JobPost } = require("../models/JobPost");
const duuniTori = require("../scrapers/duuniTori");
const indeed = require("../scrapers/indeed");

// Scrape jobs from the websites
exports.scrapeDuuniToriJobs = async (req, res) => {
  const { city, searchTerm } = req.query;
  try {
    await duuniTori(city, searchTerm);
    res.status(200).send("Job scraping complete and data saved.");
  } catch (err) {
    console.error("Error in scrapeJobs controller:", err);
    res.status(500).send("Error scraping jobs.");
  }
};

exports.scrapeIndeedJobs = async (req, res) => {
  const { city, searchTerm } = req.query;
  try {
    await indeed(city, searchTerm);
    res.status(200).send("Job scraping complete and data saved.");
  } catch (err) {
    console.error("Error in scrapeJobs controller:", err);
    res.status(500).send("Error scraping jobs.");
  }
};

// Get all job posts
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single job post by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to find jobs by title, location, or both
exports.findJobs = async (req, res) => {
  try {
    const { title, location } = req.params;

    // Build the query object based on provided parameters
    const query = {};

    if (title && title !== "undefined") {
      query.title = { $regex: new RegExp(title, "i") }; // Case-insensitive search
    }

    if (location && location !== "undefined") {
      query.location = { $regex: new RegExp(location, "i") }; // Case-insensitive search
    }

    // Find jobs based on the query
    const jobs = await JobPost.find(query);

    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found matching the criteria" });
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete a job post by ID
exports.deleteJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await job.remove();
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const { JobPost } = require("../models/JobPost");
const duuniTori = require("../scrapers/duuniTori");
const indeed = require("../scrapers/indeed");
const jobly = require("../scrapers/jobly");
const mongoose = require("mongoose");

// Scrape jobs from all the websites
exports.scrapeJobs = async (req, res) => {
  const { page, city, searchTerm } = req.query;

  try {
    // Fetch job results from all sources (duuniTori, indeed, jobly)
    const results = await Promise.all([
      duuniTori(city, searchTerm, page),
      indeed(city, searchTerm, page),
      jobly(city, searchTerm, page),
    ]);

    // Flatten the results into a single array since each API returns an array
    const allResults = results.flat();

    if (allResults) {
      // Filter out jobs that don't meet the required schema
      const filteredResults = allResults.filter((job) => {
        // Ensure required fields are present and of correct type
        const hasRequiredFields =
          typeof job.title === "string" &&
          typeof job.company === "string" &&
          typeof job.location === "string" &&
          typeof job.datePosted === "string" &&
          typeof job.url === "string";

        // Ensure required fields are not empty
        const requiredFieldsNotEmpty =
          job.title && job.company && job.location && job.datePosted && job.url;

        // Return jobs that pass both checks
        return hasRequiredFields && requiredFieldsNotEmpty;
      });

      // Now proceed with checking against existing jobs in the database
      const jobsToCheck = filteredResults.map((job) => ({
        title: job.title,
        company: job.company,
        location: job.location,
      }));

      const existingJobs = await JobPost.find({
        $or: jobsToCheck.map((job) => ({
          title: job.title,
          company: job.company,
          location: job.location,
        })),
      })
        .select("title company location")
        .lean();

      const existingJobIdentifiers = new Set(
        existingJobs.map((job) => `${job.title}|${job.company}|${job.location}`)
      );

      // Filter out jobs that already exist in the database
      const newJobs = filteredResults.filter((job) => {
        const identifier = `${job.title}|${job.company}|${job.location}`;
        if (existingJobIdentifiers.has(identifier)) {
          console.log(
            `Duplicate job found: ${job.title} at ${job.company} in ${job.location}`
          );
          return false;
        }
        return true;
      });

      // Check if there are new jobs to insert
      if (newJobs.length > 0) {
        try {
          // Insert new jobs into the database
          await JobPost.insertMany(newJobs);
          console.log(`Inserted ${newJobs.length} new jobs.`);
          res.status(201).json({
            message: `Job scraping complete. ${page} page/s scraped. ${newJobs.length} new job post/s saved.`,
          });
        } catch (error) {
          console.error("Error saving new jobs:", error.message);
          return res
            .status(500)
            .json({ message: "Error saving new jobs", error: error.message });
        }
      } else {
        console.log("No new jobs to insert. All jobs already exist.");
        res.status(200).json({
          message: `Job scraping complete. ${page} page/s scraped. ${newJobs.length} new job post/s saved. Database already has the newest.`,
        });
      }
    }
  } catch (err) {
    console.error("Error in scrapeJobs controller:", err);
    res
      .status(500)
      .json({ message: "Error scraping jobs.", error: err.message });
  }
};

// Scrape jobs from DuuniTori
exports.scrapeDuuniToriJobs = async (req, res) => {
  const { page, city, searchTerm } = req.query;

  try {
    // Fetch results from the 'duuniTori' function
    const result = await duuniTori(city, searchTerm, page);

    if (result) {
      // Filter out jobs that don't meet the required schema
      const filteredResults = result.filter((job) => {
        // Ensure required fields are present and of correct type
        const hasRequiredFields =
          typeof job.title === "string" &&
          typeof job.company === "string" &&
          typeof job.location === "string" &&
          typeof job.datePosted === "string" &&
          typeof job.url === "string";

        // Ensure required fields are not empty
        const requiredFieldsNotEmpty =
          job.title && job.company && job.location && job.datePosted && job.url;

        // Filter jobs that pass both checks
        return hasRequiredFields && requiredFieldsNotEmpty;
      });

      // Now proceed with checking against existing jobs in the database
      const jobsToCheck = filteredResults.map((job) => ({
        title: job.title,
        company: job.company,
        location: job.location,
      }));

      const existingJobs = await JobPost.find({
        $or: jobsToCheck.map((job) => ({
          title: job.title,
          company: job.company,
          location: job.location,
        })),
      })
        .select("title company location")
        .lean();

      const existingJobIdentifiers = new Set(
        existingJobs.map((job) => `${job.title}|${job.company}|${job.location}`)
      );

      // Filter out jobs that already exist in the database
      const newJobs = filteredResults.filter((job) => {
        const identifier = `${job.title}|${job.company}|${job.location}`;
        if (existingJobIdentifiers.has(identifier)) {
          console.log(
            `Duplicate job found: ${job.title} at ${job.company} in ${job.location}`
          );
          return false;
        }
        return true;
      });

      // Check if there are new jobs to insert
      if (newJobs.length > 0) {
        try {
          // Insert new jobs into the database
          await JobPost.insertMany(newJobs);
          console.log(`Inserted ${newJobs.length} new jobs.`);
          res.status(201).json({
            message: `Job scraping complete. ${page} page/s scraped. ${newJobs.length} new job post/s saved.`,
          });
        } catch (error) {
          console.error("Error saving new jobs:", error.message);
          return res
            .status(500)
            .json({ message: "Error saving new jobs", error: error.message });
        }
      } else {
        console.log("No new jobs to insert. All jobs already exist.");
        res.status(200).json({
          message: `Job scraping complete. ${page} page/s scraped. ${newJobs.length} new job post/s saved. Database already has the newest.`,
        });
      }
    }
  } catch (err) {
    console.error("Error in scrapeDuuniToriJobs controller:", err);
    res
      .status(500)
      .json({ message: "Error scraping jobs.", error: err.message });
  }
};

// Scrape jobs from indeed
exports.scrapeIndeedJobs = async (req, res) => {
  const { start, city, searchTerm } = req.query;

  try {
    // Get the results from the 'indeed' function
    const result = await indeed(city, searchTerm, start);

    if (result) {
      // Filter out jobs that don't meet the required schema
      const filteredResults = result.filter((job) => {
        // Ensure required fields are present and of correct type
        const hasRequiredFields =
          typeof job.title === "string" &&
          typeof job.company === "string" &&
          typeof job.location === "string" &&
          typeof job.datePosted === "string" &&
          typeof job.url === "string";

        // Ensure required fields are not empty
        const requiredFieldsNotEmpty =
          job.title && job.company && job.location && job.datePosted && job.url;

        // Filter jobs that pass both checks
        return hasRequiredFields && requiredFieldsNotEmpty;
      });

      // Now proceed with checking against existing jobs in the database
      const jobsToCheck = filteredResults.map((job) => ({
        title: job.title,
        company: job.company,
        location: job.location,
      }));

      const existingJobs = await JobPost.find({
        $or: jobsToCheck.map((job) => ({
          title: job.title,
          company: job.company,
          location: job.location,
        })),
      })
        .select("title company location")
        .lean();

      const existingJobIdentifiers = new Set(
        existingJobs.map((job) => `${job.title}|${job.company}|${job.location}`)
      );

      // Filter out jobs that already exist in the database
      const newJobs = filteredResults.filter((job) => {
        const identifier = `${job.title}|${job.company}|${job.location}`;
        if (existingJobIdentifiers.has(identifier)) {
          console.log(
            `Duplicate job found: ${job.title} at ${job.company} in ${job.location}`
          );
          return false;
        }
        return true;
      });

      // Check if there are new jobs to insert
      if (newJobs.length > 0) {
        try {
          // Insert new jobs into the database
          await JobPost.insertMany(newJobs);
          console.log(`Inserted ${newJobs.length} new jobs.`);
          res.status(201).json({
            message: `Job scraping complete. ${start / 10} page/s scraped. ${
              newJobs.length
            } new job post/s saved.`,
          });
        } catch (error) {
          console.error("Error saving new jobs:", error.message);
          return res
            .status(500)
            .json({ message: "Error saving new jobs", error: error.message });
        }
      } else {
        console.log("No new jobs to insert. All jobs already exist.");
        res.status(200).json({
          message: `Job scraping complete. ${start / 10} page/s scraped. ${
            newJobs.length
          } new job post/s saved. Database Already has the newest.`,
        });
      }
    }
  } catch (err) {
    console.error("Error in scrapeIndeedJobs controller:", err);
    res
      .status(500)
      .json({ message: "Error scraping jobs.", error: err.message });
  }
};

exports.scrapeJoblyJobs = async (req, res) => {
  const { page, city, searchTerm } = req.query;

  try {
    // Fetch results from the 'jobly' function
    const result = await jobly(city, searchTerm, page);

    if (result) {
      // Filter out jobs that don't meet the required schema
      const filteredResults = result.filter((job) => {
        // Ensure required fields are present and of correct type
        const hasRequiredFields =
          typeof job.title === "string" &&
          typeof job.company === "string" &&
          typeof job.location === "string" &&
          typeof job.datePosted === "string" &&
          typeof job.url === "string";

        // Ensure required fields are not empty
        const requiredFieldsNotEmpty =
          job.title && job.company && job.location && job.datePosted && job.url;

        // Filter jobs that pass both checks
        return hasRequiredFields && requiredFieldsNotEmpty;
      });

      // Now proceed with checking against existing jobs in the database
      const jobsToCheck = filteredResults.map((job) => ({
        title: job.title,
        company: job.company,
        location: job.location,
      }));

      const existingJobs = await JobPost.find({
        $or: jobsToCheck.map((job) => ({
          title: job.title,
          company: job.company,
          location: job.location,
        })),
      })
        .select("title company location")
        .lean();

      const existingJobIdentifiers = new Set(
        existingJobs.map((job) => `${job.title}|${job.company}|${job.location}`)
      );

      // Filter out jobs that already exist in the database
      const newJobs = filteredResults.filter((job) => {
        const identifier = `${job.title}|${job.company}|${job.location}`;
        if (existingJobIdentifiers.has(identifier)) {
          console.log(
            `Duplicate job found: ${job.title} at ${job.company} in ${job.location}`
          );
          return false;
        }
        return true;
      });

      // Check if there are new jobs to insert
      if (newJobs.length > 0) {
        try {
          // Insert new jobs into the database
          await JobPost.insertMany(newJobs);
          console.log(`Inserted ${newJobs.length} new jobs.`);
          res.status(201).json({
            message: `Job scraping complete. ${page} page/s scraped. ${newJobs.length} new job post/s saved.`,
          });
        } catch (error) {
          console.error("Error saving new jobs:", error.message);
          return res
            .status(500)
            .json({ message: "Error saving new jobs", error: error.message });
        }
      } else {
        console.log("No new jobs to insert. All jobs already exist.");
        res.status(200).json({
          message: `Job scraping complete. ${page} page/s scraped. ${newJobs.length} new job post/s saved. Database already has the newest.`,
        });
      }
    }
  } catch (err) {
    console.error("Error in scrapeJobs controller:", err);
    res
      .status(500)
      .json({ message: "Error scraping jobs.", error: err.message });
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

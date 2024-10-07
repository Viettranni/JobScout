const { JobPost } = require("../models/JobPost");

const duuniTori = require("../scrapers/duuniTori");
const indeed = require("../scrapers/indeed");
const jobly = require("../scrapers/jobly");
const oikotie = require("../scrapers/oikotie");
const tePalvelut = require("../scrapers/tePalvelut");

const mongoose = require("mongoose");

// Scrape jobs from all the websites
exports.scrapeJobs = async (req, res) => {
  const { page, city, searchTerm } = req.query;

  try {
    // Use Promise.allSettled to handle partial scraper failures
    const results = await Promise.allSettled([
      duuniTori(city, searchTerm, page),
      indeed(city, searchTerm, page),
      jobly(city, searchTerm, page),
      oikotie(city, searchTerm),
      tePalvelut(city, searchTerm),
    ]);

    // Collect successful results
    const successfulResults = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    // Log or track failed scrapers
    const failedScrapers = results
      .filter((result) => result.status === "rejected")
      .map((result, index) => {
        const scraperNames = [
          "duuniTori",
          "indeed",
          "jobly",
          "oikotie",
          "tePalvelut",
        ];
        console.error(
          `Scraper failed: ${scraperNames[index]} - ${result.reason.message}`
        );
        return scraperNames[index];
      });

    // Flatten the successful results into a single array
    const allResults = successfulResults.flat();

    if (allResults.length > 0) {
      // Filter out jobs that don't meet the required schema
      const filteredResults = allResults.filter((job) => {
        const hasRequiredFields =
          typeof job.title === "string" &&
          typeof job.company === "string" &&
          typeof job.location === "string" &&
          typeof job.datePosted === "string" &&
          typeof job.url === "string";

        return (
          hasRequiredFields &&
          job.title &&
          job.company &&
          job.location &&
          job.datePosted &&
          job.url
        );
      });

      // Check against existing jobs in the database using 'title', 'company', 'location', and 'url'
      const jobsToCheck = filteredResults.map((job) => ({
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
      }));

      // Query the database for jobs that match by title, company, location, or url
      const existingJobs = await JobPost.find({
        $or: jobsToCheck.map((job) => ({
          $or: [
            { title: job.title, company: job.company, location: job.location },
            { url: job.url }, // Checking against the unique 'url' field
          ],
        })),
      })
        .select("title company location url")
        .lean();

      const existingJobIdentifiers = new Set(
        existingJobs.map(
          (job) => `${job.title}|${job.company}|${job.location}|${job.url}`
        )
      );

      // Filter out jobs that already exist in the database based on title, company, location, or url
      const newJobs = filteredResults.filter((job) => {
        const identifier = `${job.title}|${job.company}|${job.location}|${job.url}`;
        return !existingJobIdentifiers.has(identifier);
      });

      if (newJobs.length > 0) {
        try {
          // Insert new jobs into the database with upsert logic to avoid duplicates
          await Promise.all(
            newJobs.map(async (job) => {
              await JobPost.updateOne(
                { url: job.url }, // Matching by URL
                { $setOnInsert: job }, // Only insert if the job does not exist
                { upsert: true } // Insert if no match, skip otherwise
              );
            })
          );

          console.log(`Inserted ${newJobs.length} new jobs.`);
          res.status(201).json({
            message: `Job scraping complete. ${successfulResults.length} jobsites scraped. ${newJobs.length} new job post/s saved.`,
            failedScrapers: failedScrapers.length
              ? `Some scrapers failed: ${failedScrapers.join(", ")}`
              : undefined,
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
          message: `Job scraping complete. ${successfulResults.length} jobsites scraped. No new job post/s saved. Database already has the newest.`,
          failedScrapers: failedScrapers.length
            ? `Some scrapers failed: ${failedScrapers.join(", ")}`
            : undefined,
        });
      }
    } else {
      res.status(500).json({
        message: "Job scraping failed. No data was successfully scraped.",
        failedScrapers: failedScrapers.length
          ? `Some scrapers failed: ${failedScrapers.join(", ")}`
          : undefined,
      });
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

// Scrape jobs from DuuniTori
exports.scrapeOikotieJobs = async (req, res) => {
  const { page, city, searchTerm } = req.query;

  try {
    // Fetch results from the 'duuniTori' function
    const result = await oikotie(city, searchTerm, page);

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

exports.scrapeTePalvelutJobs = async (req, res) => {
  const { city, searchTerm, totalJobs } = req.query;

  try {
    // Fetch results from the 'duuniTori' function
    const result = await tePalvelut(city, searchTerm, totalJobs);

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
            message: `Job scraping complete. ${newJobs.length} new job post/s saved.`,
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
          message: `Job scraping complete. ${newJobs.length} new job post/s saved. Database already has the newest.`,
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
    const jobs = await JobPost.find(filter).skip(skip).limit(parseInt(limit));

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

    const jobs = await JobPost.find(query).skip(skip).limit(limit);
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

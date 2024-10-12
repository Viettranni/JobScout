require("dotenv").config();
const { JobPost } = require("../models/JobPost");
// Import scrapers
const duuniTori = require("./duuniTori");
const indeed = require("./indeed");
const jobly = require("./jobly");
const oikotie = require("./oikotie");
const tePalvelut = require("./tePalvelut");

// Scraper function
const scrapeJobs = async (city, searchTerm, page) => {
  try {
    const results = await Promise.allSettled([
      duuniTori(city, searchTerm, page),
      indeed(city, searchTerm, page),
      jobly(city, searchTerm, page),
      oikotie(city, searchTerm),
      tePalvelut(city, searchTerm),
    ]);

    const successfulResults = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

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

    const allResults = successfulResults.flat();

    if (allResults.length > 0) {
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

      const jobsToCheck = filteredResults.map((job) => ({
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
      }));

      const existingJobs = await JobPost.find({
        $or: jobsToCheck.map((job) => ({
          $or: [
            { title: job.title, company: job.company, location: job.location },
            { url: job.url },
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

      const newJobs = filteredResults.filter((job) => {
        const identifier = `${job.title}|${job.company}|${job.location}|${job.url}`;
        return !existingJobIdentifiers.has(identifier);
      });

      if (newJobs.length > 0) {
        await Promise.all(
          newJobs.map(async (job) => {
            await JobPost.updateOne(
              { url: job.url },
              { $setOnInsert: job },
              { upsert: true }
            );
          })
        );

        console.log(`Inserted ${newJobs.length} new jobs.`);
        return {
          message: `Job scraping complete. ${successfulResults.length} jobsites scraped. ${newJobs.length} new job post/s saved.`,
          failedScrapers,
        };
      } else {
        console.log("No new jobs to insert. All jobs already exist.");
        return {
          message: `Job scraping complete. ${successfulResults.length} jobsites scraped. No new job post/s saved.`,
          failedScrapers,
        };
      }
    } else {
      return {
        message: "Job scraping failed. No data was successfully scraped.",
        failedScrapers,
      };
    }
  } catch (err) {
    console.error("Error in scrapeJobs controller:", err);
    throw new Error(`Error scraping jobs: ${err.message}`);
  }
};

// scrapeJobs("helsinki", "software", 1);

module.exports = scrapeJobs;

// cronScheduler.js

const cron = require("node-cron");
const scrapeJobs = require("./scraperManager"); // Adjust path if needed

// Define the list of search terms and cities
const searchTerms = [
  "design",
  "marketing",
  "technology",
  "finance",
  "teknologia",
  "finanssi",
  "business",
  "markkinointi",
  "software",
  "ohjelmointi",
  "it",
  "",
];

const cities = ["helsinki", "suomi", ""];

const fiveseconds = "*/5 * * * * *";
const thirtyseconds = "*/30 * * * * *";
const fivehours = "0 */5 * * *";

// Function to set up and run the cron job
const startJobScrapingCron = () => {
  // Schedule job scraping every 5 hours
  cron.schedule(fivehours, async () => {
    console.log("Running the scheduled scraping job...");

    try {
      // Loop through each combination of search term and city
      for (const searchTerm of searchTerms) {
        for (const city of cities) {
          console.log(
            `Scraping for searchTerm: "${searchTerm}", city: "${city}"`
          );
          const page = 1; // Default page for now (can modify to handle pagination)

          try {
            // Run the scraper for the current search term and city
            const result = await scrapeJobs(city, searchTerm, page);
            console.log(result.message);
          } catch (error) {
            console.error(
              `Error scraping for searchTerm: "${searchTerm}", city: "${city}" - ${error.message}`
            );
          }
        }
      }
    } catch (error) {
      console.error("Error running the scheduled scraping job:", error.message);
    }
  });
};

module.exports = startJobScrapingCron;

// scraperManager.js
const schedule = require("node-schedule");

const duuniTori = require("./scrapers/duuniTori");
const indeed = require("./scrapers/indeed");
const jobly = require("./scrapers/jobly");
// const linkedin = require("./scrapers/linkedin");
const oikotie = require("./scrapers/oikotie");
const tePalvelut = require("./scrapers/tePalvelut");

const scraperMap = {
  site1: duuniTori,
  site2: indeed,
  site3: jobly,
  // site4: linkedin,
  site5: oikotie,
  site6: tePalvelut,
};

const scrapeAllSites = async (page, city, searchTerm) => {
  try {
    console.log("Starting scheduled scraping...");

    // Create an array to store the results of each scraper
    const scrapedResults = [];

    // Iterate over all scrapers and execute them
    for (const [site, scraper] of Object.entries(scraperMap)) {
      console.log(`Scraping ${site}...`);
      const data = await scraper(page, city, searchTerm); // Get the scraped data from each scraper
      console.log(`${site} scraped successfully.`);

      // Push the result to the scrapedResults array
      scrapedResults.push(data);
    }

    console.log("Scheduled scraping completed.");

    // Return the array of scraped results
    return scrapedResults;
  } catch (error) {
    console.error("Error during scheduled scraping:", error);
    return null; // Return null or some error indicator in case of failure
  }
};

// Schedule the scraping job || Not being called in the app.js yet
const scheduleScraping = () => {
  // Run the job every day at midnight
  schedule.scheduleJob("0 0 * * *", scrapeAllSites); // Cron expression for daily at midnight
};

scrapeAllSites()
  .then((jobs) => {
    console.log("Final job list:", jobs);
  })
  .catch((error) => {
    console.error("Error during the scraping process:", error);
  });

module.exports = {
  scrapeAllSites,
  scheduleScraping,
};

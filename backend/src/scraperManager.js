// scraperManager.js
const schedule = require('node-schedule');

const duuniTori = require('./scrapers/duuniTori');
const indeed = require('./scrapers/indeed');
const jobly = require('./scrapers/jobly');
const linkedin = require('./scrapers/linkedin');
const oikotie = require('./scrapers/oikotie');
const tePalvelut = require('./scrapers/tePalvelut');


const scraperMap = {
    site1: duuniTori,
    site2: indeed,
    site3: jobly,
    site4: linkedin,
    site5: oikotie,
    site6: tePalvelut
    
};

// Function to scrape all sites
const scrapeAllSites = async () => {
    try {
        console.log('Starting scheduled scraping...');

        // Iterate over all scrapers and execute them
        for (const [site, scraper] of Object.entries(scraperMap)) {
            console.log(`Scraping ${site}...`);
            await scraper();
            console.log(`${site} scraped successfully.`);
        }

        console.log('Scheduled scraping completed.');
    } catch (error) {
        console.error('Error during scheduled scraping:', error);
    }
};

// Schedule the scraping job || Not being called in the app.js yet
const scheduleScraping = () => {
    // Run the job every day at midnight
    schedule.scheduleJob('0 0 * * *', scrapeAllSites); // Cron expression for daily at midnight
};

module.exports = { 
    scrapeAllSites,
    scheduleScraping
 };

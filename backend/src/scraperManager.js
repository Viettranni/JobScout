require('dotenv').config();
const mongoose = require('mongoose');
const scrapeLinkedInJobs = require('./scrapers/linkedin'); 
const scrapeOikotieJobs = require('./scrapers/oikotie');
const scrapeTePalvelutJobs = require('./scrapers/tePalvelut')


const startScraping = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {  });
    console.log("Connected to MongoDB Atlas");

    // Calling the scraping functions from the scrapers
    await scrapeLinkedInJobs();
    console.log("LinkedIn scraping completed!");

    await scrapeOikotieJobs();
    console.log("Oikotie scraping completed!")

    await scrapeTePalvelutJobs();
    console.log("TePalvelut scraping completed!")

    
  } catch (err) {
    console.error("Error during scraping process", err);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
  }
};

startScraping();

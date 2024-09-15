require('dotenv').config();
const mongoose = require('mongoose');
const scrapeLinkedInJobs = require('./scrapers/linkedin'); 


const startScraping = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {  });
    console.log("Connected to MongoDB Atlas");

    // Start scraping tasks
    await scrapeLinkedInJobs();
    console.log("LinkedIn scraping complete");

    // await scrapeOtherWebsite();
    // console.log("Other website scraping complete");

  } catch (err) {
    console.error("Error during scraping process", err);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
  }
};

startScraping();

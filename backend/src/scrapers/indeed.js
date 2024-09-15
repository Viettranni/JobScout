const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Job = require('../models/Job');
require('dotenv').config();

const scrapeLinkedInJobs = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const baseURL = "https://www.linkedin.com/jobs/search?keywords=&location=Finland&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0";
  await page.goto(baseURL, { waitUntil: "networkidle2" });

  // Handle modals and scrolling as in your original script

  // Scrape job listings
  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.base-card'))
      .map((jobElement) => {
        const title = jobElement.querySelector(".base-search-card__title")?.innerText.trim() || "N/A";
        const company = jobElement.querySelector(".base-search-card__subtitle")?.innerText.trim() || "N/A";
        const location = jobElement.querySelector(".base-search-card__metadata")?.innerText.trim() || "N/A";
        const jobUrl = jobElement.querySelector(".base-card__full-link")?.getAttribute("href") || "";
        const logoUrl = jobElement.querySelector(".artdeco-entity-image.artdeco-entity-image--square-4.lazy-loaded")?.getAttribute("src") || "N/A";
        const postedTime = jobElement.querySelector(".job-search-card__listdate")?.innerText.trim() || "N/A";

        return { title, company, location, url: jobUrl, logoUrl, postedTime };
      });
  });

  // For each job, navigate to its detail page and scrape the job description
  for (let job of jobs) {
    if (job.url) {
      await page.goto(job.url, { waitUntil: "networkidle2" });

      // Scrape the job description
      const jobDescription = await page.evaluate(() => {
        const descriptionElement = document.querySelector('.description__text'); // Adjust this selector based on the job page layout
        return descriptionElement?.innerText.trim() || 'No description available';
      });

      job.description = jobDescription;

      // Save job to MongoDB
      const newJob = new Job(job);
      await newJob.save();
    }
  }

  await browser.close();
};

const startScraping = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB Atlas");
    await scrapeLinkedInJobs();
    console.log("Scraping complete");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas", err);
  } finally {
    mongoose.disconnect();
  }
};

startScraping();

const express = require('express');
const Job = require('../models/JobPost');

const router = express.Router();

// Get all jobs
router.get('/jobs', async (req, res) => {
    const jobs = await Job.find({});
    res.json(jobs);
});

// Trigger scraping
router.post('/scrape', async (req, res) => {
    const scrapeSite1 = require('../scrapers/site1Scraper');
    await scrapeSite1();
    res.send('Scraping Done!');
});

module.exports = router;

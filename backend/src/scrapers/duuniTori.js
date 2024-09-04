// Example code, modify

const puppeteer = require('puppeteer');
const JobPost = require('../models/JobPost');

const duuniTori = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto('https://duunitori.fi/tyopaikat', { waitUntil: 'networkidle2' });


    const jobs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.job-listing')).map(job => ({
            title: job.querySelector('.job-title').innerText,
            description: job.querySelector('.job-description').innerText,
            salary: job.querySelector('.job-salary').innerText,
            datePosted: new Date(job.querySelector('.job-date').innerText),
            url: job.querySelector('a').href,
        }));
    });

    // After collecting the data from the JobPost.js models you can store the data to database
    await JobPost.insertMany(jobs);
    await browser.close();
};

module.exports = duuniTori;

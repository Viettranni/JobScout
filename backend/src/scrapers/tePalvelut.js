const puppeteer = require('puppeteer');
const JobPost = require('../models/JobPost');

const scrapeTePalvelutJobs = async () => {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the job listings page
    await page.goto('https://paikat.te-palvelut.fi/tpt/?professions=1,2,3,4,5,6,7,8,9,0,X0&announced=0&leasing=0&remotely=0&english=false&sort=1', { waitUntil: 'networkidle2' });

    // Wait for job postings to load
    await page.waitForSelector('.col-xs-12.list-group-item');

    // Extract job postings and their links (limit to 10)
    const jobPostings = await page.evaluate(() => {
        const posts = Array.from(document.querySelectorAll('.col-xs-12.list-group-item'));
        return posts.slice(0, 10).map(post => {
            const title = post.querySelector('h4')?.innerText.trim();
            const link = post.querySelector('a')?.href;
            const company = post.querySelector('span[aria-label=""]')?.innerText.trim();
            const logoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrxpfmPZOQR26e2nNra9BYyVZDFqcoR8jhGw&amp;s%22%20class=%22sFlh5c%20FyHeAf",
            const responsibilities = ""

            return { title, url: link, company, logo, responsibilities };
        }).filter(post => post.url);
    });

    // Function to extract job details (description, date, location) from a job page
    const getJobDetails = async (jobPageUrl) => {
        const jobPage = await browser.newPage();
        await jobPage.goto(jobPageUrl, { waitUntil: 'networkidle2' });

        // Extract job description from "Kuvaus" tab (default tab)
        const description = await jobPage.evaluate(() => {
            const descriptionElement = document.querySelector('.detailText');
            return descriptionElement ? descriptionElement.innerText.trim() : 'No description found';
        });

        // Click on the "Tiedot" tab to access location and date
        await jobPage.evaluate(() => {
            const tiedotTab = Array.from(document.querySelectorAll('ul.nav-tabs li')).find(tab => tab.innerText.includes('Tiedot'));
            if (tiedotTab) {
                tiedotTab.querySelector('a').click();
            }
        });
        await jobPage.waitForSelector('div.col-xs-7.detailValue', { timeout: 5000 }); // Wait for the tab content to load

        // Extract closing date from "Tiedot" tab
        const postedTime = await jobPage.evaluate(() => {
            const dateElement = Array.from(document.querySelectorAll('div.col-xs-7.detailValue')).find(el => el.innerText.includes('klo'));
            return dateElement ? dateElement.innerText.trim() : 'No closing date found';
        });

        // Extract location from "Tiedot" tab
        const location = await jobPage.evaluate(() => {
            const locationElement = Array.from(document.querySelectorAll('div.col-xs-7.detailValue')).find(el => el.innerText.match(/^\d{5}/)); // Match zip code at the start
            return locationElement ? locationElement.innerText.trim() : 'No location found';
        });

        await jobPage.close();
        return { description, postedTime, location };
    };

    // Get job details, check for duplicates, and save to MongoDB
    for (let posting of jobPostings) {
        // Check if a job post with the same title already exists in the database
        const existingJob = await JobPost.findOne({ title: posting.title });

        if (existingJob) {
            console.log(`Skipped job: ${posting.title} - Already exists in the database`);
            continue; // Skip if the job already exists
        }

        // Get the job details
        const details = await getJobDetails(posting.url);
        posting.description = details.description;
        posting.datePosted = details.datePosted;
        posting.location = details.location;
        // Assuming logoUrl is not available in this source; set to null or remove if not used
        posting.logo = "tePalvelut"; 

        // Save the job posting to MongoDB
        try {
            const newJob = new JobPost(posting);
            await newJob.save();
            console.log(`Saved job to database: ${posting.title}`);
        } catch (err) {
            console.error(`Failed to save job: ${posting.title}`, err);
        }
    }

    // Close the browser
    await browser.close();

    console.log('Job scraping and saving complete');
};

module.exports = scrapeTePalvelutJobs;
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the job listings page
    await page.goto('https://tyopaikat.oikotie.fi/tyopaikat', { waitUntil: 'networkidle2' });

    // Wait for job postings to load
    await page.waitForSelector('article.job-ad-list-item');

    // Extract job postings and their links
    const jobPostings = await page.evaluate(() => {
        const posts = Array.from(document.querySelectorAll('article.job-ad-list-item'));
        return posts.map(post => {
            const title = post.querySelector('h2.title a')?.innerText.trim();
            const date = post.querySelector('time')?.innerText.trim();
            const link = post.querySelector('h2.title a')?.href;
            const company = post.querySelector('.body .employer')?.innerText.trim();
            const location = post.querySelector('.body .locations')?.innerText.trim();
            const logoUrl = post.querySelector('.picture-img')?.src.trim();
            return { title, date, link, company, location, logoUrl };
        }).filter(post => post.link);
    });

    // Function to extract job description from a job page
    const getJobDetails = async (jobPageUrl) => {
        const jobPage = await browser.newPage();
        await jobPage.goto(jobPageUrl, { waitUntil: 'networkidle2' });

        // Extract the job description
        const description = await jobPage.evaluate(() => {
            const descriptionElement = document.querySelector('.section[data-e2e-component="job-ad-description"] .text-wrapper');
            return descriptionElement ? descriptionElement.innerText.trim() : 'No description found';
        });

        await jobPage.close();
        return description;
    };

    // Get job descriptions and update job postings
    for (const posting of jobPostings) {
        posting.description = await getJobDetails(posting.link);
    }

    // Save the results to a file
    fs.writeFileSync('jobPostingsWithDetails.json', JSON.stringify(jobPostings, null, 2));

    // Close the browser
    await browser.close();

    console.log('Job postings with details have been saved to jobPostingsWithDetails.json');
})();

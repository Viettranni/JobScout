const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const jobList = [];

const scrapeOikotieJobs = async (city, searchTerm) => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Base URL and query parameters setup
  const baseURL = "https://tyopaikat.oikotie.fi/tyopaikat";
  const queryParams = [];

  if (city) queryParams.push(`${city}`);
  if (searchTerm) queryParams.push(`hakusana=${searchTerm}`);

  // Construct the final URL
  const url = queryParams.length
    ? `${baseURL}/${queryParams.join("?")}`
    : baseURL;

  console.log(`Navigating to URL: ${url}`);

  // Navigate to the job listings page
  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  // Wait for job postings to load
  // await page.waitForSelector('article.job-ad-list-item');

  try {
    const cookiesAcceptButtonSelector =
      'button[data-control-name="accept_cookie"]';
    await page.waitForSelector(cookiesAcceptButtonSelector, { timeout: 5000 });
    await page.click(cookiesAcceptButtonSelector); // Accept cookies
    console.log("Cookies accepted");
  } catch (err) {
    console.log("No cookie consent modal found");
  }

  // Extract job postings and their links
  const jobPostings = await page.evaluate(() => {
    const posts = Array.from(
      document.querySelectorAll("article.job-ad-list-item")
    );
    return posts.map((post) => {
      const title = post.querySelector("h2.title a")?.innerText.trim();
      const datePosted = post.querySelector("time")?.innerText.trim();
      const jobUrl = post.querySelector("h2.title a")?.href;
      const company = post.querySelector(".body .employer")?.innerText.trim();
      const location = post.querySelector(".body .locations")?.innerText.trim();
      const logo = "oikotie";
      const responsibilities = "";
      return {
        title,
        datePosted,
        url: jobUrl,
        company,
        location,
        logo,
        responsibilities,
      };
    });
  });

  // Function to extract job description from a job page
  const getJobDetails = async (jobPageUrl) => {
    const jobPage = await browser.newPage();
    await jobPage.goto(jobPageUrl, { waitUntil: "networkidle2" });

    // Extract the job description
    const description = await jobPage.evaluate(() => {
      const descriptionElement = document.querySelector(
        '.section[data-e2e-component="job-ad-description"] .text-wrapper'
      );
      return descriptionElement
        ? descriptionElement.innerText.trim()
        : "No description found";
    });

    await jobPage.close();
    return description;
  };

  // Get job descriptions, check for duplicates, and save to MongoDB
  for (let posting of jobPostings) {
    // Check if a job post with the same title already exists in the database
    // const existingJob = await JobPost.findOne({ title: posting.title });

    // if (existingJob) {
    //     console.log(`Skipped job: ${posting.title} - Already exists in the database`);
    //     continue; // Skip if the job already exists
    // }

    // Get the job description
    posting.description = await getJobDetails(posting.url);
    jobList.push(posting);

    // // Save the job posting to MongoDB
    // try {
    //     const newJob = new JobPost(posting);
    //     await newJob.save();
    //     console.log(`Saved job to database: ${posting.title}`);
    // } catch (err) {
    //     console.error(`Failed to save job: ${posting.title}`, err);
    // }
  }

  // Close the browser
  await browser.close();

  console.log(jobList);
  console.log("Job scraping and saving complete");
  return jobList;
};

// scrapeOikotieJobs("helsinki", "lääkäri");

module.exports = scrapeOikotieJobs;

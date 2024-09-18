const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { JobPost } = require("../models/JobPost");

puppeteer.use(StealthPlugin());

const jobList = [];

// Function to scrape job details from individual job pages
const scrapeJobDescription = async (jobUrl, browser) => {
  const jobPage = await browser.newPage(); // Open a new tab for each job
  await jobPage.goto(jobUrl, { waitUntil: "domcontentloaded" });

  const jobDetails = await jobPage.evaluate(() => {
    const title =
      document.querySelector("#jobDescriptionTitleHeading")?.innerText.trim() ||
      "N/A";
    const location =
      document
        .querySelector("#jobLocationText .css-45str8")
        ?.innerText.trim() || "N/A";
    const description =
      document.querySelector("#jobDescriptionText")?.innerText.trim() ||
      "No description available";

    // Collect responsibilities from the bullet points in the job description
    const responsibilitiesList = Array.from(
      document.querySelectorAll("#jobDescriptionText ul li")
    ).map((item) => item.innerText.trim());

    return {
      title,
      location,
      description,
      responsibilities: responsibilitiesList,
    };
  });

  await jobPage.close(); // Close the tab after scraping
  return jobDetails;
};

// Function to fetch job details for all job URLs
const fetchJobs = async (jobUrls, browser) => {
  const jobDetailsPromises = jobUrls.map(async (jobUrl) => {
    if (jobUrl !== "N/A") {
      console.log(`Scraping job details for URL: ${jobUrl}`);
      try {
        return await scrapeJobDescription(jobUrl, browser);
      } catch (error) {
        console.error(`Error scraping job details for URL ${jobUrl}:`, error);
        return null;
      }
    }
    return null;
  });

  return Promise.all(jobDetailsPromises);
};

const indeed = async (city = "", searchTerm = "") => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Base URL for Indeed
  const baseURL = "https://fi.indeed.com/jobs";

  // Collect query parameters
  const queryParams = [];

  if (city) {
    queryParams.push(`l=${encodeURIComponent(city)}`);
  }

  if (searchTerm) {
    queryParams.push(`q=${encodeURIComponent(searchTerm)}`);
  }

  // Construct the final URL
  const url = queryParams.length
    ? `${baseURL}?${queryParams.join("&")}`
    : baseURL;

  console.log(`Navigating to URL: ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Handle the cookies modal (if it appears)
  try {
    const cookiesAcceptButtonSelector = "#onetrust-accept-btn-handler";
    await page.waitForSelector(cookiesAcceptButtonSelector, { timeout: 5000 });
    await page.click(cookiesAcceptButtonSelector);
    console.log("Cookies modal accepted");
  } catch (err) {
    console.log("No cookies modal found or failed to interact with it");
  }

  // Scrape the job listings
  const jobs = await page.evaluate((searchTerm) => {
    // Function to parse the datePosted string
    const parseDatePosted = (datePostedStr) => {
      const match = datePostedStr.match(/(\d+)\s+päivää sitten/);
      if (match) {
        const daysAgo = parseInt(match[1], 10);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString();
      }
      return "N/A";
    };

    return Array.from(document.querySelectorAll("li.css-5lfssm"))
      .map((jobElement) => {
        const title =
          jobElement.querySelector("h2.jobTitle a")?.innerText.trim() || "N/A";
        const company =
          jobElement
            .querySelector('span[data-testid="company-name"]')
            ?.innerText.trim() || "N/A";
        const location =
          jobElement
            .querySelector('div[data-testid="text-location"]')
            ?.innerText.trim() || "N/A";
        const datePosted =
          jobElement
            .querySelector('span[data-testid="myJobsStateDate"]')
            ?.innerText.trim() || "N/A";
        const jobUrl = jobElement.querySelector("h2.jobTitle a")?.href || "N/A";

        return {
          title,
          company,
          location,
          datePosted: parseDatePosted(datePosted),
          url: jobUrl,
          category: searchTerm, // Using search term as the category
        };
      })
      .filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, searchTerm);

  // Extract job URLs for detailed scraping
  const jobUrls = jobs.map((job) => job.url);

  // Fetch detailed job information
  const jobDetails = await fetchJobs(jobUrls, browser);

  // Combine job information with detailed descriptions
  jobs.forEach((job, index) => {
    if (jobDetails[index]) {
      job.description = jobDetails[index].description;
      job.responsibilities = jobDetails[index].responsibilities;
      job.logo = "indeed";
    }
    jobList.push(job); // Add job to jobList
  });

  // // Store the data in the database
  // try {
  //   await JobPost.insertMany(jobList);
  //   console.log("Jobs saved to the database");
  // } catch (err) {
  //   console.error("Error saving jobs to the database:", err);
  // }

  await browser.close();

  console.log("Scraping complete. Jobs:", jobs);
  console.log(`Total jobs scraped: ${jobs.length}`);
  return jobList;
};

// // Example usage with dynamic parameters provided by the user
// const city = "helsinki"; // Example of city parameter
// const searchTerm = "software engineer"; // Example of a search term

// indeed(city, searchTerm);

module.exports = indeed;

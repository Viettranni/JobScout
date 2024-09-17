const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { JobPost } = require("../models/JobPost");

puppeteer.use(StealthPlugin());

const jobList = [];

// Function to scrape job details from individual job pages
const scrapeJobDetails = async (jobUrl, browser) => {
  const jobPage = await browser.newPage(); // Open a new tab for each job
  await jobPage.goto(jobUrl, { waitUntil: "networkidle2" });

  const jobDetails = await jobPage.evaluate(() => {
    const descriptionElement = document.querySelector(".description-box");
    if (!descriptionElement) return {};

    // Extract the full description text
    const descriptionText = descriptionElement.innerText.trim();

    // Extract responsibilities specifically if they are in a separate list
    const responsibilitiesElement =
      descriptionElement.querySelector("strong + ul");
    const responsibilitiesText = responsibilitiesElement
      ? responsibilitiesElement.innerText.trim()
      : "N/A";

    return {
      description: descriptionText,
      responsibilities: responsibilitiesText,
    };
  });

  await jobPage.close(); // Close the tab after scraping
  return jobDetails;
};

// Function to fetch job details for all job URLs concurrently
const fetchJobDetailsConcurrently = async (jobUrls, browser) => {
  const jobDetailsPromises = jobUrls.map(async (jobUrl) => {
    if (jobUrl !== "N/A") {
      console.log(`Scraping job details for URL: ${jobUrl}`);
      try {
        return await scrapeJobDetails(jobUrl, browser);
      } catch (error) {
        console.error(`Error scraping job details for URL ${jobUrl}:`, error);
        return null;
      }
    }
    return null;
  }); 

  return Promise.all(jobDetailsPromises);
};

const duuniTori = async (city = "", searchTerm = "") => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Base URL
  const baseURL = "https://duunitori.fi/tyopaikat";

  // Collect query parameters
  const queryParams = [];

  if (city) {
    queryParams.push(`alue=${encodeURIComponent(city)}`);
  }

  if (searchTerm) {
    queryParams.push(`haku=${encodeURIComponent(searchTerm)}`);
  }

  // Construct the final URL
  const url = queryParams.length
    ? `${baseURL}?${queryParams.join("&")}`
    : baseURL;

  console.log(`Navigating to URL: ${url}`);
  await page.goto(url, { waitUntil: "networkidle2" });

  // Handle the cookies modal (if it appears)
  try {
    const cookiesAcceptButtonSelector = ".gdpr-modal__button--accept";
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
      const match = datePostedStr.match(/Julkaistu (\d+)\.(\d+)/);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const year = new Date().getFullYear();
        return new Date(year, month, day).toISOString();
      }
      return "N/A";
    };

    return Array.from(document.querySelectorAll(".job-box"))
      .map((jobElement) => {
        const title =
          jobElement.querySelector(".job-box__title")?.innerText.trim() ||
          "N/A";
        const company =
          jobElement
            .querySelector(".job-box__logo-container img")
            ?.getAttribute("alt")
            ?.replace(" logo", "") || "N/A";
        const location =
          jobElement
            .querySelector(".job-box__job-location span")
            ?.innerText.trim()
            .split("–")[0] || "N/A";
        const datePosted =
          jobElement.querySelector(".job-box__job-posted")?.innerText.trim() ||
          "N/A";
        const jobUrl = jobElement.querySelector("a.job-box__hover")?.href || "";
        const category =
          jobElement
            .querySelector("a.job-box__hover")
            ?.getAttribute("data-category") || "N/A";

        return {
          title,
          company,
          location,
          datePosted: parseDatePosted(datePosted),
          url: jobUrl,
          category,
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

  // Fetch detailed job information concurrently
  const jobDetails = await fetchJobDetailsConcurrently(jobUrls, browser);

  // Combine job information with detailed descriptions
  jobs.forEach((job, index) => {
    if (jobDetails[index]) {
      job.description = jobDetails[index].description;
      job.responsibilities = jobDetails[index].responsibilities;
    }
    jobList.push(job); // Add job to jobList
  });

  // Store the data in the database
  try {
    await JobPost.insertMany(jobList);
    console.log("Jobs saved to the database");
  } catch (err) {
    console.error("Error saving jobs to the database:", err);
  }

  await browser.close();

  console.log("Scraping complete. Jobs:", jobs);
  console.log(`Total jobs scraped: ${jobs.length}`);
};

// // Example usage with dynamic parameters provided by the user
// const city = "helsinki"; // Example of city parameter
// const searchTerm = "software engineer"; // Example of a search term

// duuniTori(city, searchTerm);

module.exports = duuniTori;

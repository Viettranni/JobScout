const puppeteer = require("puppeteer");
const JobPost = require("../models/JobPost");

const jobList = [];

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
  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".job-box")).map(
      (jobElement) => {
        // Extract data using querySelector
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
        const category = jobElement.getAttribute("data-category") || "N/A"; // Extract category from data-category attribute

        return {
          title,
          company,
          location,
          datePosted,
          url: `https://duunitori.fi${jobUrl}`,
          category,
        };
      }
    );
  });

  // Add jobs to jobList
  jobList.push(...jobs);

  // Store the data in the database
  try {
    await JobPost.insertMany(jobList);
    console.log("Jobs saved to the database");
  } catch (err) {
    console.error("Error saving jobs to the database:", err);
  }

  await browser.close();

  console.log("Scraping complete. Jobs:", jobs);
};

// Example usage with dynamic parameters provided by the user
const city = "helsinki"; // Example of city parameter
const searchTerm = "software engineer"; // Example of an empty search term

duuniTori(city, searchTerm);

module.exports = duuniTori;

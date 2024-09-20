const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { JobPost } = require("../models/JobPost");

puppeteer.use(StealthPlugin());

const jobList = [];

const jobly = async (city = "", searchTerm = "") => {
  const browser = await puppeteer.launch({ headless: false }); // Launch Puppeteer in headless mode
  const page = await browser.newPage();

  const baseURL = `https://www.jobly.fi/tyopaikat`;

  // Collect query parameters
  const queryParams = [];

  if (city) {
    queryParams.push(`job_geo_location=${encodeURIComponent(city)}`);
  }

  if (searchTerm) {
    queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
  }

  // Construct the final URL
  const url = queryParams.length
    ? `${baseURL}?${queryParams.join("&")}`
    : baseURL;

  console.log(`Navigating to URL: ${url}`);

  // Navigate to the target URL
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Wait for job elements to load
  await page.waitForSelector(".views-row");

  // Extract job listings
  const jobs = await page.evaluate(() => {
    const jobElements = document.querySelectorAll(".views-row");

    return Array.from(jobElements).map((job) => {
      // Extract job title
      const titleElement = job.querySelector("article div a");
      const title = titleElement
        ? titleElement.getAttribute("title")
        : "Title not found";

      // Extract company name
      const companyElement = job.querySelector(
        "article div.mobile_job__content div.job__content div.description span.recruiter-company-profile-job-organization a"
      );
      const company = companyElement
        ? companyElement.textContent.trim()
        : "Company not found";

      // Extract location
      const locationElement = job.querySelector(
        "article div div div.location span"
      );
      const location = locationElement
        ? locationElement.textContent.trim()
        : "Location not found";

      // Extract date posted
      const datePostedElement = job.querySelector(
        "article div.mobile_job__content div.job__content div.description span.date"
      );
      const datePosted = datePostedElement
        ? datePostedElement.textContent.trim()
        : "Date not found";

      // Extract job URL
      const urlElement = job.querySelector("article div.job__logo a");
      const url = urlElement
        ? urlElement.getAttribute("href")
        : "Url not found";

      // Return the basic job information
      return { title, company, location, datePosted, url };
    });
  });

  // Log the extracted jobs data
  console.log("Job listings:", jobs);

  // Function to visit each job link and extract more details
  for (const job of jobs) {
    if (job.url && job.url !== "Url not found") {
      console.log(`Visiting job: ${job.title}`);
      updatedJob = await visitJobPage(browser, job);
      updatedJob.logo = "jobly";
      jobList.push(updatedJob);
    }
  }

  // Close the browser
  await browser.close();

  console.log("Scraping complete. Jobs:", jobList);
  console.log(`Total jobs scraped: ${jobs.length}`);
  return jobList;
};

// Function to visit the job page and extract more details
const visitJobPage = async (browser, job) => {
  const page = await browser.newPage();

  // Navigate to the job page
  await page.goto(job.url, { waitUntil: "domcontentloaded" });

  // Extract job description and responsibilities from the job page
  const jobDetails = await page.evaluate(() => {
    const descriptionElement = document.querySelectorAll(
      "div.field__item.even p"
    );
    const responsibilitiesElement = document.querySelectorAll(
      "div.field__item.even ul li"
    );

    // Extract the job description
    const description = descriptionElement
      ? Array.from(descriptionElement)
          .map((p) => p.textContent.trim())
          .join(" ")
      : "Description not found";

    // Extract responsibilities if available
    const responsibilities = responsibilitiesElement
      ? Array.from(responsibilitiesElement).map((li) => li.textContent.trim())
      : ["Responsibilities not found"];

    // Return the extracted job description and responsibilities
    return { description, responsibilities };
  });

  // Update the job with detailed information
  const updatedJob = { ...job, ...jobDetails };

  // Log or save the detailed job information
  console.log(`Details for job ${job.title} at ${job.url}:`, updatedJob);

  // Close the page after visiting
  await page.close();

  return updatedJob;
};

// // Call the jobly function to start scraping
// const run = async () => {
//   const city = "Helsinki";
//   const searchTerm = "lääkäri";

//   try {
//     const results = await jobly(city, searchTerm);
//     console.log("Final result:", results, "Final result:");
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// run();

module.exports = jobly;

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { JobPost } = require("../models/JobPost");

puppeteer.use(StealthPlugin());

const jobList = [];

const jobly = async (city = "", searchTerm = "", totalPages = 1) => {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: false }); // Launch Puppeteer
    const page = await browser.newPage();

    const baseURL = `https://www.jobly.fi/tyopaikat`;

    // Loop through the specified number of pages (default is 20 pages)
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      // Collect query parameters and append the page number
      const queryParams = [];

      if (city) {
        queryParams.push(`job_geo_location=${encodeURIComponent(city)}`);
      }

      if (searchTerm) {
        queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
      }

      queryParams.push(`page=${currentPage}`); // Add pagination

      // Construct the final URL
      const url = queryParams.length
        ? `${baseURL}?${queryParams.join("&")}`
        : baseURL;

      console.log(`Navigating to URL: ${url}`);

      try {
        // Navigate to the target URL
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Wait for job elements to load
        const selector = await page
          .waitForSelector(".views-row", { timeout: 3000 })
          .catch(() => null);

        if (!selector) {
          console.log(`No job listings found on page ${currentPage}.`);
          break;
        }

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

        console.log(`Filtered job listings on page ${currentPage}:`, jobs);

        // Visit each job link and extract more details
        for (const job of jobs) {
          if (job.url && job.url !== "Url not found") {
            console.log(`Visiting job: ${job.title}`);
            const updatedJob = await visitJobPage(browser, job);
            updatedJob.logo = "jobly"; // Example to add a logo or tag to the job
            jobList.push(updatedJob);
          }
        }

        console.log(`Finished scraping page ${currentPage}`);
      } catch (error) {
        console.error(`Error scraping page ${currentPage}:`, error);
      }
    }
  } catch (error) {
    console.error("Error occurred during the main scraping process:", error);
  } finally {
    if (browser) {
      await browser.close(); // Ensure the browser is closed
    }
    console.log("Scraping complete. Jobs:", jobList);
    console.log(`Total jobs scraped: ${jobList.length}`);
    console.log(`Total pages scraped: ${totalPages}`);
    return jobList;
  }
};

// Function to visit the job page and extract more details
const visitJobPage = async (browser, job) => {
  const page = await browser.newPage();
  try {
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

    return updatedJob;
  } catch (error) {
    console.error(`Error visiting job page for ${job.title}:`, error);
    return job; // Return the original job data if an error occurs
  } finally {
    await page.close(); // Ensure the page is closed
  }
};

// // Call the jobly function to start scraping
// const run = async () => {
//   const city = "utsjoki";
//   const searchTerm = "software engineer"; // Example search term

//   try {
//     const results = await jobly(city, searchTerm, 5); // Scrape 20 pages
//     console.log("Final result:", results);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// run();

module.exports = jobly;

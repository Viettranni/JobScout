const axios = require("axios");
const cheerio = require("cheerio");
const { JobPost } = require("../models/JobPost");

const jobList = [];

const jobly = async (city = "", searchTerm = "", totalPages = 1) => {
  try {
    const baseURL = `https://www.jobly.fi/tyopaikat`;

    // Loop through the specified number of pages
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
        // Fetch the page content using axios
        const { data: html } = await axios.get(url);

        // Load the HTML using cheerio
        const $ = cheerio.load(html);

        // Check if there are job elements
        const jobElements = $(".views-row");

        if (jobElements.length === 0) {
          console.log(`No job listings found on page ${currentPage}.`);
          break;
        }

        // Extract job listings
        const jobs = jobElements
          .map((i, job) => {
            const titleElement = $(job).find("article div a");
            const title = titleElement.attr("title") || "Title not found";

            const companyElement = $(job).find(
              "article div.mobile_job__content div.job__content div.description span.recruiter-company-profile-job-organization a"
            );
            const company = companyElement.text().trim() || "Company not found";

            const locationElement = $(job).find(
              "article div div div.location span"
            );
            const location =
              locationElement.text().trim() || "Location not found";

            const datePostedElement = $(job).find(
              "article div.mobile_job__content div.job__content div.description span.date"
            );
            const datePosted =
              datePostedElement.text().trim() || "Date not found";

            const urlElement = $(job).find("article div.job__logo a");
            const url = urlElement.attr("href") || "Url not found";

            // Return the basic job information
            return { title, company, location, datePosted, url };
          })
          .get();

        console.log(`Filtered job listings on page ${currentPage}:`, jobs);

        // Visit each job link and extract more details
        for (const job of jobs) {
          if (job.url && job.url !== "Url not found") {
            console.log(`Visiting job: ${job.title}`);
            const updatedJob = await visitJobPage(job);
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
    console.log("Scraping complete. Jobs:", jobList);
    console.log(`Total jobs scraped: ${jobList.length}`);
    console.log(`Total pages scraped: ${totalPages}`);
    return jobList;
  }
};

// Function to visit the job page and extract more details
const visitJobPage = async (job) => {
  try {
    // Fetch the job page content using axios
    const { data: html } = await axios.get(job.url);

    // Load the HTML using cheerio
    const $ = cheerio.load(html);

    // Extract job description and responsibilities from the job page
    const descriptionElement = $("div.field__item.even p");
    const responsibilitiesElement = $("div.field__item.even ul li");

    // Extract the job description
    const description = descriptionElement
      ? descriptionElement
          .map((i, el) => $(el).text().trim())
          .get()
          .join(" ")
      : "Description not found";

    // Extract responsibilities if available
    const responsibilities = responsibilitiesElement
      ? responsibilitiesElement.map((i, el) => $(el).text().trim()).get()
      : ["Responsibilities not found"];

    // Update the job with detailed information
    const updatedJob = { ...job, description, responsibilities };

    // Log or save the detailed job information
    console.log(`Details for job ${job.title} at ${job.url}:`, updatedJob);

    return updatedJob;
  } catch (error) {
    console.error(`Error visiting job page for ${job.title}:`, error);
    return job; // Return the original job data if an error occurs
  }
};

// // Call the jobly function to start scraping
// const run = async () => {
//   const city = "helsinki";
//   const searchTerm = "software engineer"; // Example search term

//   try {
//     const results = await jobly(city, searchTerm, 5); // Scrape 5 pages
//     console.log("Final result:", results);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// run();

module.exports = jobly;

const axios = require("axios");
const cheerio = require("cheerio");

const jobList = [];

// Function to scrape job details from individual job pages
const scrapeJobDetails = async (jobUrl) => {
  try {
    const { data: html } = await axios.get(jobUrl);
    const $ = cheerio.load(html);

    const descriptionElement = $(".description-box");
    if (!descriptionElement.length) return {};

    const descriptionText = descriptionElement.text().trim();

    const responsibilitiesElement = descriptionElement.find("strong + ul");
    const responsibilitiesText = responsibilitiesElement.length
      ? responsibilitiesElement.text().trim()
      : "N/A";

    return {
      description: descriptionText,
      responsibilities: responsibilitiesText,
    };
  } catch (error) {
    console.error(`Error scraping job details for URL ${jobUrl}:`, error);
    return {}; // Return an empty object in case of error
  }
};

// Function to fetch job details for all job URLs sequentially
const fetchJobDetailsSequentially = async (jobUrls) => {
  const jobDetails = [];

  for (let jobUrl of jobUrls) {
    if (jobUrl && jobUrl.startsWith("http")) {
      console.log(`Scraping job details for URL: ${jobUrl}`);
      try {
        const details = await scrapeJobDetails(jobUrl);
        jobDetails.push(details);
      } catch (error) {
        console.error(`Error scraping job details for URL ${jobUrl}:`, error);
        jobDetails.push(null); // Push null in case of error
      }
    } else {
      console.error(`Invalid URL: ${jobUrl}`);
      jobDetails.push(null);
    }
  }

  return jobDetails;
};

// Main function to scrape jobs from duunitori.fi
const duuniTori = async (city = "", searchTerm = "", totalPages = 1) => {
  const baseURL = "https://duunitori.fi/tyopaikat";
  const queryParams = [];

  if (city) queryParams.push(`alue=${encodeURIComponent(city)}`);
  if (searchTerm) queryParams.push(`haku=${encodeURIComponent(searchTerm)}`);

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const url = `${baseURL}?sivu=${pageNum}&${queryParams.join("&")}`;
    console.log(`Fetching URL: ${url}`);

    try {
      const { data: html } = await axios.get(url);
      const $ = cheerio.load(html);

      // Scrape job listings from the current page
      const jobs = $(".job-box")
        .map((_, jobElement) => {
          const title =
            $(jobElement).find(".job-box__title").text().trim() || "N/A";
          const company =
            $(jobElement)
              .find(".job-box__logo-container img")
              .attr("alt")
              ?.replace(" logo", "") || "N/A";
          const location =
            $(jobElement)
              .find(".job-box__job-location span")
              .text()
              .trim()
              .split("–")[0] || "N/A";
          const datePosted =
            $(jobElement).find(".job-box__job-posted").text().trim() || "N/A";
          let jobUrl =
            $(jobElement).find("a.job-box__hover").attr("href") || "";

          // Check if the URL is relative, and if so, prepend the base URL
          if (jobUrl.startsWith("/")) {
            jobUrl = `https://duunitori.fi${jobUrl}`;
          }
          const category =
            $(jobElement).find("a.job-box__hover").attr("data-category") ||
            "N/A";

          return {
            title,
            company,
            location,
            datePosted,
            url: jobUrl,
            category,
          };
        })
        .get(); // .get() converts Cheerio object to array

      // Extract job URLs for detailed scraping
      const jobUrls = jobs.map((job) => job.url);
      console.log(jobUrls);

      // Fetch job details sequentially
      const jobDetails = await fetchJobDetailsSequentially(jobUrls);

      // Combine job information with detailed descriptions
      jobs.forEach((job, index) => {
        if (jobDetails[index]) {
          job.description = jobDetails[index].description;
          job.responsibilities = jobDetails[index].responsibilities;
          job.logo = "duunitori";
        }
        jobList.push(job);
      });
    } catch (error) {
      console.error(`Error fetching or parsing page ${pageNum}:`, error);
    }
  }

  console.log("Scraping complete. Jobs:", jobList);
  console.log(`Total jobs scraped: ${jobList.length}`);
  return jobList;
};

// Example usage with dynamic parameters provided by the user
// const city = ""; // Example of city parameter
// const searchTerm = ""; // Example of a search term
// const totalPages = 3; // Specify how many pages to scrape

// duuniTori(city, searchTerm, totalPages);

module.exports = duuniTori;

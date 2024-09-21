const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const jobList = [];

// Function to scrape job details from individual job pages
const scrapeJobDetails = async (jobUrl, browser) => {
  try {
    const jobPage = await browser.newPage(); // Open a new tab for each job
    await jobPage.goto(jobUrl, { waitUntil: "domcontentloaded" });

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
  } catch (error) {
    console.error(`Error scraping job details for URL ${jobUrl}:`, error);
    return {}; // Return an empty object if there's an error
  }
};

// Function to fetch job details for all job URLs sequentially
const fetchJobDetailsSequentially = async (jobUrls, browser) => {
  const jobDetails = [];

  for (let jobUrl of jobUrls) {
    // Check if the jobUrl is valid before proceeding
    if (jobUrl && jobUrl.startsWith("http")) {
      console.log(`Scraping job details for URL: ${jobUrl}`);
      try {
        const details = await scrapeJobDetails(jobUrl, browser); // Scrape each job sequentially
        jobDetails.push(details); // Collect the scraped details
      } catch (error) {
        console.error(`Error scraping job details for URL ${jobUrl}:`, error);
        jobDetails.push(null); // Push null in case of error
      }
    } else {
      console.error(`Invalid URL: ${jobUrl}`);
      jobDetails.push(null); // Skip invalid URLs and push null
    }
  }

  return jobDetails; // Return the list of job details
};

// Main function to scrape jobs from duunitori.fi
const duuniTori = async (city = "", searchTerm = "", totalPages = 1) => {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Base URL and query parameters setup
    const baseURL = "https://duunitori.fi/tyopaikat";
    const queryParams = [];

    if (city) queryParams.push(`alue=${encodeURIComponent(city)}`);
    if (searchTerm) queryParams.push(`haku=${encodeURIComponent(searchTerm)}`);

    // Loop through the specified number of pages
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const url = `${baseURL}?sivu=${pageNum}&${queryParams.join("&")}`;
      console.log(`Navigating to URL: ${url}`);
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Handle cookies modal if necessary
      try {
        const cookiesAcceptButtonSelector = ".gdpr-modal__button--accept";
        await page.waitForSelector(cookiesAcceptButtonSelector, {
          timeout: 5000,
        });
        await page.click(cookiesAcceptButtonSelector);
      } catch (err) {
        console.log("No cookies modal found or failed to interact with it");
      }

      // Scrape job listings from the current page
      const jobs = await page.evaluate((searchTerm) => {
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
              jobElement
                .querySelector(".job-box__job-posted")
                ?.innerText.trim() || "N/A";
            const jobUrl =
              jobElement.querySelector("a.job-box__hover")?.href || "";
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

      // Fetch job details sequentially instead of concurrently
      const jobDetails = await fetchJobDetailsSequentially(jobUrls, browser);

      // Combine job information with detailed descriptions
      jobs.forEach((job, index) => {
        if (jobDetails[index]) {
          job.description = jobDetails[index].description;
          job.responsibilities = jobDetails[index].responsibilities;
          job.logo = "duunitori";
        }
        jobList.push(job); // Add job to jobList
      });
    }
  } catch (error) {
    console.error("Error occurred during scraping:", error);
  } finally {
    if (browser) {
      await browser.close(); // Always close the browser, even if there is an error
    }
    console.log("Scraping complete. Jobs:", jobList);
    console.log(`Total jobs scraped: ${jobList.length}`);
    return jobList; // Always return the jobList
  }
};

// Example usage with dynamic parameters provided by the user
// const city = "helsinki"; // Example of city parameter
// const searchTerm = "software engineer"; // Example of a search term
// const totalPages = 3; // Specify how many pages to scrape

// duuniTori(city, searchTerm, totalPages);

module.exports = duuniTori;

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { JobPost } = require("../models/JobPost");

puppeteer.use(StealthPlugin());

const jobList = [];

// Function to scrape job details from individual job pages
const scrapeJobDescription = async (jobUrl, browser) => {
  try {
    const jobPage = await browser.newPage(); // Open a new tab for each job
    await jobPage.goto(jobUrl, { waitUntil: "domcontentloaded" });

    const jobDetails = await jobPage.evaluate(() => {
      const title =
        document
          .querySelector("#jobDescriptionTitleHeading")
          ?.innerText.trim() || "N/A";
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
  } catch (error) {
    console.error(`Error scraping job description from URL ${jobUrl}:`, error);
    return null; // Return null if there's an error
  }
};

// Function to fetch job details for all job URLs (synchronous version)
const fetchJobs = async (jobUrls, browser) => {
  for (const jobUrl of jobUrls) {
    if (jobUrl !== "N/A") {
      console.log(`Scraping job details for URL: ${jobUrl}`);
      try {
        const details = await scrapeJobDescription(jobUrl, browser);
        if (details) {
          jobList.push(details);
        }
      } catch (error) {
        console.error(`Error scraping job details for URL ${jobUrl}:`, error);
      }
    }
  }
};

const indeed = async (city = "", searchTerm = "", totalPages = 10) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: false });
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

    const increment = 10; // Number of jobs per page

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex += increment) {
      const pageURL = queryParams.length
        ? `${baseURL}?${queryParams.join("&")}&start=${pageIndex}`
        : `${baseURL}?start=${pageIndex}`;

      console.log(`Navigating to URL: ${pageURL}`);
      await page.goto(pageURL, { waitUntil: "domcontentloaded" });

      // Handle the cookies modal (if it appears)
      try {
        const cookiesAcceptButtonSelector = "#onetrust-accept-btn-handler";
        await page.waitForSelector(cookiesAcceptButtonSelector, {
          timeout: 5000,
        });
        await page.click(cookiesAcceptButtonSelector);
        console.log("Cookies modal accepted");
      } catch (err) {
        console.log("No cookies modal found or failed to interact with it");
      }

      // Scrape the job listings for the current page
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
              jobElement.querySelector("h2.jobTitle a")?.innerText.trim() ||
              "N/A";
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
            const jobUrl =
              jobElement.querySelector("h2.jobTitle a")?.href || "N/A";

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

      // Fetch detailed job information (synchronously)
      await fetchJobs(jobUrls, browser);

      // Combine job information with detailed descriptions
      jobs.forEach((job, index) => {
        if (jobList[index]) {
          job.description = jobList[index].description;
          job.responsibilities = jobList[index].responsibilities;
          job.logo = "indeed";
        }
        jobList.push(job); // Add job to jobList
      });

      console.log(`Page ${pageIndex / increment + 1} scraped successfully.`);
    }
  } catch (error) {
    console.error("Error occurred during scraping:", error);
  } finally {
    if (browser) {
      await browser.close(); // Always close the browser, even if there is an error
    }
    console.log("Scraping complete. Jobs:", jobList);
    console.log(`Total jobs scraped: ${jobList.length}`);
    console.log(`Total pages scraped: ${totalPages / 10}`);
    return jobList; // Always return the jobList
  }
};

// // Example usage with dynamic parameters provided by the user
// const city = "helsinki"; // Example of city parameter
// const searchTerm = "software engineer"; // Example of a search term
// const totalPages = 30; // Example of scraping 50 pages

// indeed(city, searchTerm, totalPages);

module.exports = indeed;

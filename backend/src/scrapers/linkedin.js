const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// Use Puppeteer Stealth Plugin
puppeteer.use(StealthPlugin());

// Define the delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const jobList = [];

const scrapeLinkedInJobs = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // No need to set the User-Agent manually since StealthPlugin handles it
  await page.setViewport({ width: 1200, height: 800 });

  const baseURL =
    "https://www.linkedin.com/jobs/search?keywords=&location=Finland&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0";
  await page.goto(baseURL, { waitUntil: "networkidle2" });

  // Handle Login Popup (if it appears)
  const handleLoginPopUp = async () => {
    try {
      const loginPopupSelector = ".artdeco-modal__actionbar button";
      await page.waitForSelector(loginPopupSelector, { timeout: 5000 });
      await page.click(loginPopupSelector); // Close login modal
      console.log("Closed login popup");
    } catch (err) {
      console.log("No login popup found");
    }
  };

  // Handle Cookie Consent Modal (if it appears)
  try {
    const cookiesAcceptButtonSelector =
      'button[data-control-name="accept_cookie"]';
    await page.waitForSelector(cookiesAcceptButtonSelector, { timeout: 5000 });
    await page.click(cookiesAcceptButtonSelector); // Accept cookies
    console.log("Cookies accepted");
  } catch (err) {
    console.log("No cookie consent modal found");
  }

  // Scroll down to load more jobs
  let previousHeight;
  let attempt = 0;
  const maxAttempts = 10;

  while (attempt < maxAttempts) {
    previousHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await delay(5000); // Wait for 5 seconds to let content load

    const newHeight = await page.evaluate(() => document.body.scrollHeight);
    if (newHeight === previousHeight) break; // If the scroll height does not change, we stop

    attempt++;
  }

  // Scrape job listings
  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".base-card")).map(
      (jobElement) => {
        const title =
          jobElement
            .querySelector(".base-search-card__title")
            ?.innerText.trim() || "N/A";
        const company =
          jobElement
            .querySelector(".base-search-card__subtitle")
            ?.innerText.trim() || "N/A";
        const location =
          jobElement
            .querySelector(".base-search-card__metadata")
            ?.innerText.trim() || "N/A";
        const jobUrl =
          jobElement
            .querySelector(".base-card__full-link")
            ?.getAttribute("href") || "";
        const logo = "Linkedin";
        const datePosted =
          jobElement
            .querySelector(".job-search-card__listdate")
            ?.innerText.trim() || "N/A";

        return { title, company, location, url: jobUrl, logo, datePosted };
      }
    );
  });

  // For each job, navigate to its detail page and scrape the job description
  for (let job of jobs) {
    if (job.url) {
      await page.goto(job.url, { waitUntil: "networkidle2", timeout: 60000 });

      await handleLoginPopUp();

      // Scrape the job description
      const jobDescription = await page.evaluate(() => {
        const descriptionElement = document.querySelector(".description__text");
        return (
          descriptionElement?.innerText.trim() || "No description available"
        );
      });

      job.description = jobDescription;
      jobList.push(job);
      console.log(`Saved job to database: ${job.title}`);
      console.log(jobList.length);
      if (jobList.length >= 2) {
        console.log("Scraping complete");
        break;
      }
    }
  }

  // Ensure browser is closed at the end
  await browser.close();
  return jobList;
};

// scrapeLinkedInJobs()
//   .then((jobs) => {
//     console.log("Final job list:", jobs);
//   })
//   .catch((error) => {
//     console.error("Error during the scraping process:", error);
//   });

module.exports = scrapeLinkedInJobs;

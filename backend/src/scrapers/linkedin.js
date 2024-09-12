const puppeteer = require('puppeteer');

const scrapeLinkedInJobs = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Go to LinkedIn Jobs search page
  const baseURL = "https://www.linkedin.com/jobs/search?keywords=&location=Finland&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0";
  await page.goto(baseURL, { waitUntil: "networkidle2" });

  // Handle Login Popup (if it appears)
  const handleLoginPopUp = async () => {
        try {
        const loginPopupSelector = '.artdeco-modal__actionbar button';
        await page.waitForSelector(loginPopupSelector, { timeout: 5000 });
        await page.click(loginPopupSelector); // Close login modal
        console.log("Closed login popup");
    } catch (err) {
        console.log("No login popup found");
    }
  }
  

  // Handle Cookie Consent Modal (if it appears)
  try {
    const cookiesAcceptButtonSelector = 'button[data-control-name="accept_cookie"]';
    await page.waitForSelector(cookiesAcceptButtonSelector, { timeout: 5000 });
    await page.click(cookiesAcceptButtonSelector); // Accept cookies
    console.log("Cookies accepted");
  } catch (err) {
    console.log("No cookie consent modal found");
  }

  // Scroll down to load more jobs (LinkedIn loads jobs dynamically as you scroll)
  const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Scroll down to load more jobs (LinkedIn loads jobs dynamically as you scroll)
  let previousHeight;
  let attempt = 0;
  const maxAttempts = 10;

  while (attempt < maxAttempts) {
    previousHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await waitFor(5000); // Wait for 5 seconds to let content load

    const newHeight = await page.evaluate(() => document.body.scrollHeight);
    if (newHeight === previousHeight) break; // If the scroll height does not change, we stop

    attempt++;
  }

  // Scrape job listings
  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.base-card'))
      .map((jobElement) => {
        const title =
          jobElement.querySelector(".base-search-card__title")?.innerText.trim() ||
          "N/A";
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
        const logoUrl =
          jobElement
            .querySelector(".artdeco-entity-image.artdeco-entity-image--square-4.lazy-loaded")
            ?.getAttribute("src") || "N/A";
        const postedTime =
          jobElement
            .querySelector(".job-search-card__listdate")
            ?.innerText.trim() || "N/A";


        return {
          title,
          company,
          location,
          url: jobUrl,
          logoUrl,
          postedTime,
 
        //   insightText, <-- TODO: Is missing the description
        };
      });
  });

  // For each job, navigate to its detail page and scrape the job description
  for (let job of jobs) {
    if (job.url) {
      await page.goto(job.url, { waitUntil: "networkidle2" });

      await handleLoginPopUp();

      // Scrape the job description
      const jobDescription = await page.evaluate(() => {
        const descriptionElement = document.querySelector('.description__text'); // Adjust this selector based on the job page layout
        return descriptionElement?.innerText.trim() || 'No description available';
      });

      job.description = jobDescription;
    }
  }

  console.log(jobs);

  await browser.close();
};

scrapeLinkedInJobs();

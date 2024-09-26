const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const jobList = [];

const tePalvelut = async (city = "", searchTerm = "", totalJobs = 10) => {
  let browser;

  const baseURL = "https://paikat.te-palvelut.fi/tpt/";

  try {
    // Launch the browser
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const queryParams = [];

    if (searchTerm) {
      queryParams.push(`searchPhrase=${encodeURIComponent(searchTerm)}`);
    }

    if (city) {
      queryParams.push(`location=${encodeURIComponent(city)}`);
    }

    // Construct the final URL
    const url = queryParams.length
      ? `${baseURL}?${queryParams.join("&")}`
      : baseURL;

    console.log(`Navigating to URL: ${url}`);

    // Navigate to the job listings page
    await page.goto(url, { waitUntil: "networkidle2" });

    // Wait for job postings to load
    await page.waitForSelector(".col-xs-12.list-group-item");

    // Extract job postings and their links
    const jobPostings = await page.evaluate(() => {
      const posts = Array.from(
        document.querySelectorAll(".col-xs-12.list-group-item")
      );
      return posts
        .map((post) => {
          const title = post.querySelector("h4")?.innerText.trim();
          const link = post.querySelector("a")?.href;
          const company = post
            .querySelector('span[aria-label=""]')
            ?.innerText.trim();
          const logo =
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrxpfmPZOQR26e2nNra9BYyVZDFqcoR8jhGw&amp;s%22%20class=%22sFlh5c%20FyHeAf";
          const responsibilities = "";

          return { title, url: link, company, logo, responsibilities };
        })
        .filter((post) => post.url);
    });

    // Function to extract job details (description, date, location) from a job page
    const getJobDetails = async (jobPageUrl) => {
      const jobPage = await browser.newPage();
      try {
        await jobPage.goto(jobPageUrl, { waitUntil: "networkidle2" });

        // Extract job description from "Kuvaus" tab (default tab)
        const description = await jobPage.evaluate(() => {
          const descriptionElement = document.querySelector(".detailText");
          return descriptionElement
            ? descriptionElement.innerText.trim()
            : "No description found";
        });

        // Click on the "Tiedot" tab to access location and date
        await jobPage.evaluate(() => {
          const tiedotTab = Array.from(
            document.querySelectorAll("ul.nav-tabs li")
          ).find((tab) => tab.innerText.includes("Tiedot"));
          if (tiedotTab) {
            tiedotTab.querySelector("a").click();
          }
        });

        await jobPage.waitForSelector("div.col-xs-7.detailValue", {
          timeout: 5000,
        }); // Wait for the tab content to load

        // Extract closing date from "Tiedot" tab
        const postedTime = await jobPage.evaluate(() => {
          const dateElement = Array.from(
            document.querySelectorAll("div.col-xs-7.detailValue")
          ).find((el) => el.innerText.includes("klo"));
          return dateElement
            ? dateElement.innerText.trim()
            : "No closing date found";
        });

        // Extract location from "Tiedot" tab
        const location = await jobPage.evaluate(() => {
          const locationElement = Array.from(
            document.querySelectorAll("div.col-xs-7.detailValue")
          ).find((el) => el.innerText.match(/^\d{5}/)); // Match zip code at the start
          return locationElement
            ? locationElement.innerText.trim()
            : "No location found";
        });

        return { description, postedTime, location };
      } catch (err) {
        console.error(`Failed to extract details from ${jobPageUrl}`, err);
        return {
          description: "Error extracting description",
          postedTime: null,
          location: null,
        };
      } finally {
        await jobPage.close();
      }
    };

    // Get job details, and push to jobList
    for (let posting of jobPostings) {
      try {
        // Get the job details
        const details = await getJobDetails(posting.url);
        posting.description = details.description;
        posting.datePosted = details.postedTime;
        posting.location = details.location;
        posting.logo = "tePalvelut"; // Assuming logoUrl is not available in this source; set to null or remove if not used
        jobList.push(posting);
        console.log(`Saved job to jobList: ${posting.title}`);

        // // Check if jobList has reached 50 jobs, if so, return it
        // if (jobList.length >= totalJobs) {
        //   console.log(
        //     `Job list length has reached ${totalJobs}, returning early.`
        //   );
        //   return jobList;
        // }
      } catch (err) {
        console.error(`Failed to process or save job: ${posting.title}`, err);
      }
    }

    console.log(`Page scraped.`);
  } catch (err) {
    console.error("Error during scraping process:", err);
  } finally {
    // Close the browser in the 'finally' block to ensure it always closes
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
    console.log("Scraping complete. Jobs:", jobList);
    console.log(`Total jobs scraped: ${jobList.length}`);
    return jobList;
  }
};

// const runScraper = async () => {
//   try {
//     // Call the function and await the result
//     const jobs = await tePalvelut("helsinki", "opettaja", 20);

//     // Log the result (jobs)
//     console.log("Scraped jobs:", jobs);
//   } catch (error) {
//     console.error("Error occurred while scraping:", error);
//   }
// };

// // Execute the async function
// runScraper();

module.exports = tePalvelut;

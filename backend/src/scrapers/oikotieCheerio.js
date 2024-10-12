const axios = require("axios");
const cheerio = require("cheerio");

const jobList = [];

const scrapeOikotieJobs = async (city, searchTerm) => {
  // Base URL and query parameters setup
  const baseURL = "https://tyopaikat.oikotie.fi/tyopaikat";
  const queryParams = [];

  if (city) queryParams.push(`${city}`);
  if (searchTerm) queryParams.push(`hakusana=${searchTerm}`);

  // Construct the final URL
  const url = queryParams.length
    ? `${baseURL}/${queryParams.join("?")}`
    : baseURL;

  console.log(`Fetching URL: ${url}`);

  try {
    // Fetch the HTML content of the page
    const { data } = await axios.get(url);

    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    // Extract job postings
    const jobPostings = $("article.job-ad-list-item")
      .map((i, post) => {
        const title = $(post).find("h2.title a").text().trim();
        const datePosted = $(post).find("time").text().trim();
        let jobUrl = $(post).find("h2.title a").attr("href");
        if (jobUrl.startsWith("/")) {
          jobUrl = `https://tyopaikat.oikotie.fi${jobUrl}`;
        }
        const company = $(post).find(".body .employer").text().trim();
        const location = $(post).find(".body .locations").text().trim();
        const logo = "oikotie"; // Static logo as in original code
        const responsibilities = ""; // Static responsibilities placeholder

        return {
          title,
          datePosted,
          url: jobUrl,
          company,
          location,
          logo,
          responsibilities,
        };
      })
      .get(); // Use `.get()` to convert Cheerio object to an array

    // Function to extract job description from the individual job page
    const getJobDetails = async (jobPageUrl) => {
      try {
        const { data: jobPageData } = await axios.get(jobPageUrl);
        const $$ = cheerio.load(jobPageData);

        // Extract the job description
        const description =
          $$('.section[data-e2e-component="job-ad-description"] .text-wrapper')
            .text()
            .trim() || "No description found";

        return description;
      } catch (err) {
        console.error(
          `Failed to fetch job details for URL: ${jobPageUrl}`,
          err
        );
        return "No description found";
      }
    };

    // Get job descriptions, check for duplicates, and save to jobList
    for (let posting of jobPostings) {
      // Check if a job post with the same title already exists (uncomment and use if needed for DB)
      // const existingJob = await JobPost.findOne({ title: posting.title });

      // if (existingJob) {
      //   console.log(`Skipped job: ${posting.title} - Already exists in the database`);
      //   continue; // Skip if the job already exists
      // }

      // Get the job description
      posting.description = await getJobDetails(posting.url);
      jobList.push(posting);

      // Uncomment and use if saving to MongoDB
      // try {
      //   const newJob = new JobPost(posting);
      //   await newJob.save();
      //   console.log(`Saved job to database: ${posting.title}`);
      // } catch (err) {
      //   console.error(`Failed to save job: ${posting.title}`, err);
      // }
    }

    console.log(jobList);
    console.log("Job scraping complete");
    return jobList;
  } catch (error) {
    console.error(`Error fetching the URL: ${url}`, error);
    return [];
  }
};

// scrapeOikotieJobs("helsinki", "software engineer");

module.exports = scrapeOikotieJobs;

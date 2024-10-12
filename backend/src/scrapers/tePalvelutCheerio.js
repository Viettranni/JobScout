const axios = require("axios");
const cheerio = require("cheerio");

// Function to fetch job postings from the API
const fetchJobPostings = async (
  searchTerm = "",
  location = "",
  totalJobs = 10
) => {
  const baseURL = "https://paikat.te-palvelut.fi/tpt-api/v1/tyopaikat";
  const params = {
    hakusana: searchTerm,
    hakusanakentta: "sanahaku",
    ilmoitettuPvm: 1,
    vuokrapaikka: "---",
    etatyopaikka: "---",
    sort: "mainAmmattiRivino asc, tehtavanimi asc, tyonantajanNimi asc, viimeinenHakupaivamaara asc",
    kentat:
      "ilmoitusnumero,tyokokemusammattikoodi,ammattiLevel3,tehtavanimi,tyokokemusammatti,tyonantajanNimi,kunta,ilmoituspaivamaara,hakuPaattyy,tyoaikatekstiYhdistetty,tyonKestoKoodi,tyonKesto,tyoaika,tyonKestoTekstiYhdistetty,hakemusOsoitetaan,maakunta,maa,hakuTyosuhdetyyppikoodi,hakuTyoaikakoodi,hakuTyonKestoKoodi",
    rows: totalJobs,
    start: 0,
    ss: true,
    "facet.fkentat":
      "hakuTyoaikakoodi,ammattikoodi,aluehaku,hakuTyonKestoKoodi,hakuTyosuhdetyyppikoodi,oppisopimus",
    "facet.fsort": "index",
    "facet.flimit": -1,
  };

  if (location) {
    params.kunta = location; // Add the location to the API parameters
  }

  try {
    // Fetch job postings
    const response = await axios.get(baseURL, { params });

    // Debugging: Log the response status and data
    console.log("API Response Status:", response.status);
    console.log("API Response Data:", response.data);

    if (response.data && Array.isArray(response.data)) {
      const jobs = await Promise.all(
        response.data.map(async (job) => {
          // Fetch job details
          const jobDetails = await fetchJobDetails(job.ilmoitusnumero);

          return {
            title: job.tehtavanimi,
            company: job.tyonantajanNimi,
            location: job.kunta,
            datePosted: job.ilmoituspaivamaara,
            url: `https://paikat.te-palvelut.fi/tpt/${job.ilmoitusnumero}`, // Job detail URL
            description: jobDetails.description,
            responsibilities: jobDetails.responsibilities,
            logo: jobDetails.logo, // Assuming logo can be retrieved from the job details
          };
        })
      );

      console.log("Job postings found:", jobs);
      return jobs;
    } else {
      console.error("No job postings found.");
      return [];
    }
  } catch (error) {
    console.error(
      "Error fetching job postings:",
      error.response ? error.response.data : error.message
    );
    return [];
  }
};

// Function to fetch details of a specific job posting
const fetchJobDetails = async (jobId) => {
  const detailsURL = `https://paikat.te-palvelut.fi/tpt/${jobId}`; // Modify this if the URL structure is different
  try {
    const response = await axios.get(detailsURL);

    const $ = cheerio.load(response.data);

    // Extracting description, responsibilities, and logo
    const description =
      $(".detailText").text().trim() || "No description found";
    const responsibilities =
      $(".responsibilities").text().trim() || "No responsibilities found"; // Adjust the selector as necessary
    const logo = $(".logo img").attr("src") || "No logo found"; // Adjust the selector as necessary

    return {
      description,
      responsibilities,
      logo,
    };
  } catch (error) {
    console.error(`Error fetching job details for ID ${jobId}:`, error);
    return {
      description: "Error fetching description",
      responsibilities: "Error fetching responsibilities",
      logo: "Error fetching logo",
    };
  }
};

// Example usage
const runScraper = async () => {
  const searchTerm = "software"; // Modify the search term here
  const location = "Helsinki"; // Modify the location here
  const jobs = await fetchJobPostings(searchTerm, location, 200);
  console.log("Scraped jobs:", jobs);
};

// Execute the async function
runScraper();

const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobControllers");

// // Routes for scraping every jobsite
// router.post("/jobs/scrape/:searchTerm/:city?", jobController.scrapeJobs);

// GET/ all jobs
router.get("/jobs", jobController.getAllJobs);
// POST/scrape all jobsites
router.post("/jobs/scrape", jobController.scrapeJobs);

// Routes for Duunitori job posts
// GET/by id
router.get("/duunitori/jobs/:id", jobController.getJobById);
// GET/by searctTerm or location
router.get("/duunitori/jobs/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searctTerm and location
router.get("/duunitori/jobs/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location
// POST/scrape
router.post("/duunitori/scrape-jobs", jobController.scrapeDuuniToriJobs);
// DELETE
router.delete("/duunitori/jobs/:id", jobController.deleteJob);

// Routes for Indeed job posts
// GET/by id
router.get("/indeed/jobs/:id", jobController.getJobById);
// GET/by searctTerm or location
router.get("/indeed/jobs/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searctTerm and location
router.get("/indeed/jobs/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location
// POST/scrape
router.post("/indeed/scrape-jobs", jobController.scrapeIndeedJobs);
// DELETE
router.delete("/indeed/jobs/:id", jobController.deleteJob);

module.exports = router;

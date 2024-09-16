const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobControllers");

// // Routes for scraping every jobsite
// router.post("/jobs/scrape/:searchTerm/:city?", jobController.scrapeJobs);

// GET/ all jobs
router.get("/", jobController.getAllJobs);
// POST/scrape all jobsites
router.post("/scrape/:searchTerm/:city?", jobController.scrapeJobs);
// GET/by id
router.get("/:id", jobController.getJobById);
// DELETE
router.delete("/:id", jobController.deleteJob);

// Routes for Duunitori job posts
// GET/by id
router.get("/duunitori/:id", jobController.getJobById);
// GET/by searctTerm or location
router.get("/duunitori/detail/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searctTerm and location
router.get("/duunitori/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location
// POST/scrape
router.post("/duunitori/scrape-jobs", jobController.scrapeDuuniToriJobs);
// DELETE
router.delete("/duunitori/:id", jobController.deleteJob);

// Routes for Indeed job posts
// GET/by id
router.get("/indeed/:id", jobController.getJobById);
// GET/by searctTerm or location
router.get("/indeed/detail/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searctTerm and location
router.get("/indeed/detail/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location
// POST/scrape
router.post("/indeed/scrape-jobs", jobController.scrapeIndeedJobs);
// DELETE
router.delete("/indeed/:id", jobController.deleteJob);

module.exports = router;

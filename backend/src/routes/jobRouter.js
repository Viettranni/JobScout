const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobControllers");

// GET/ all jobs
router.get("/getAllJobs", jobController.getAllJobs);
// POST/scrape all jobsites
router.post("/allsites/scrape-jobs", jobController.scrapeJobs);
// GET/by id
router.get("/:id", jobController.getJobById);
// DELETE
router.delete("/:id", jobController.deleteJob);

// Routes for Duunitori job posts
// GET/by id
router.get("/duunitori/:id", jobController.getJobById);
// GET/by searchTerm or location
router.get("/duunitori/detail/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searchTerm and location
router.get("/duunitori/detail/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location
// POST/scrape
router.post("/duunitori/scrape-jobs", jobController.scrapeDuuniToriJobs);
// DELETE
router.delete("/duunitori/:id", jobController.deleteJob);

// Routes for Indeed job posts
// GET/by id
router.get("/indeed/:id", jobController.getJobById);
// GET/by searchTerm or location
router.get("/indeed/detail/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searchTerm and location
router.get("/indeed/detail/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location
// POST/scrape
router.post("/indeed/scrape-jobs", jobController.scrapeIndeedJobs);
// DELETE
router.delete("/indeed/:id", jobController.deleteJob);

// Routes for Jobly job posts
// GET/by id
router.get("/jobly/:id", jobController.getJobById);
// GET/by searchTerm or location
router.get("/jobly/detail/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searchTerm and location
router.get("/jobly/detail/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location
// POST/scrape
router.post("/jobly/scrape-jobs", jobController.scrapeJoblyJobs);
// DELETE
router.delete("/jobly/:id", jobController.deleteJob);

// Routes for Oikotie job posts
// GET/by id
router.get("/oikotie/:id", jobController.getJobById);
// GET/by searchTerm or location
router.get("/oikotie/detail/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searchTerm and location
router.get("/oikotie/detail/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location
// POST/scrape
router.post("/oikotie/scrape-jobs", jobController.scrapeOikotieJobs);
// DELETE
router.delete("/oikotie/:id", jobController.deleteJob);

module.exports = router;

const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobControllers");

// Routes for Duunitori job posts
router.get("/duunitori/jobs", jobController.getAllJobs);
router.get("/duunitori/scrape-jobs", jobController.scrapeDuuniToriJobs);
router.get("/duunitori/jobs/:id", jobController.getJobById);
// router.post("/jobs", jobController.createJob);
// router.put("/jobs/:id", jobController.updateJob);
router.delete("/duunitori/jobs/:id", jobController.deleteJob);
router.get("/duunitori/jobs/:title?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
router.get("/duunitori/jobs/:title/:location?", jobController.findJobs); // Matches /jobs/:title/:location

// Routes for Indeed job posts
router.get("/indeed/jobs", jobController.getAllJobs);
router.get("/indeed/scrape-jobs", jobController.scrapeIndeedJobs);
router.get("/indeed/jobs/:id", jobController.getJobById);
// router.post("/jobs", jobController.createJob);
// router.put("/jobs/:id", jobController.updateJob);
router.delete("/indeed/jobs/:id", jobController.deleteJob);
router.get("/indeed/jobs/:title?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
router.get("/indeed/jobs/:title/:location?", jobController.findJobs); // Matches /jobs/:title/:location

module.exports = router;

const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobControllers");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// GET/ all jobs
router.get("/", jobController.getAllJobs);
// GET/by id
router.get("/:id", jobController.getJobById);

// Routes for Duunitori job posts
// GET/by id
router.get("/duunitori/:id", jobController.getJobById);
// GET/by searchTerm or location
router.get("/duunitori/detail/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searchTerm and location
router.get("/duunitori/detail/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location

// Routes for Indeed job posts
// GET/by id
router.get("/indeed/:id", jobController.getJobById);
// GET/by searchTerm or location
router.get("/indeed/detail/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searchTerm and location
router.get("/indeed/detail/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location

// Routes for Jobly job posts
// GET/by id
router.get("/jobly/:id", jobController.getJobById);
// GET/by searchTerm or location
router.get("/jobly/detail/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searchTerm and location
router.get("/jobly/detail/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location

// Routes for Oikotie job posts
// GET/by id
router.get("/oikotie/:id", jobController.getJobById);
// GET/by searchTerm or location
router.get("/oikotie/detail/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searchTerm and location
router.get("/oikotie/detail/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location
// DELETE

// Routes for Oikotie job posts
// GET/by id
router.get("/tepalvelut/:id", jobController.getJobById);
// GET/by searchTerm or location
router.get("/tepalvelut/detail/:searchTerm?", jobController.findJobs); // Matches /jobs/:title or /jobs/:title/:location
// GET/by searchTerm and location
router.get("/tepalvelut/detail/:searchTerm/:city?", jobController.findJobs); // Matches /jobs/:title/:location

router.use(authMiddleware);
// POST/scrape all jobsites
router.post("/allsites/scrape-jobs", jobController.scrapeJobs);
// POST/scrape
router.post("/duunitori/scrape-jobs", jobController.scrapeDuuniToriJobs);
// POST/scrape
router.post("/indeed/scrape-jobs", jobController.scrapeIndeedJobs);
// POST/scrape
router.post("/jobly/scrape-jobs", jobController.scrapeJoblyJobs);
// POST/scrape
router.post("/oikotie/scrape-jobs", jobController.scrapeOikotieJobs);
// POST/scrape
router.post("/tepalvelut/scrape-jobs", jobController.scrapeTePalvelutJobs);
// DELETE
router.delete("/:id", jobController.deleteJob);
// DELETE
router.delete("/duunitori/:id", jobController.deleteJob);
// DELETE
router.delete("/indeed/:id", jobController.deleteJob);
// DELETE
router.delete("/oikotie/:id", jobController.deleteJob);
// DELETE
router.delete("/jobly/:id", jobController.deleteJob);
// DELETE
router.delete("/tepalvelut/:id", jobController.deleteJob);

module.exports = router;

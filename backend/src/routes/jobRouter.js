const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobControllers");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// GET/ all jobs
router.get("/", jobController.getAllJobs);
// GET/by id
router.get("/:id", jobController.getJobById);

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

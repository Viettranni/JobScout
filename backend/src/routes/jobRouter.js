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

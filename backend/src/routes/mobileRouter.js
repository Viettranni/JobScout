const express = require("express");
const router = express.Router();
const mobileControllers = require("../controllers/mobileControllers");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/mobileGetAll", mobileControllers.getAllJobsMobile);

module.exports = router;
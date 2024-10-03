const express = require("express");
const router = express.Router();
const aiModelController = require("../controllers/aiModelController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", aiModelController.createCoverLetter);

module.exports = router;    
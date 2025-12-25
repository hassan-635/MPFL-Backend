const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadProofs,
  getProjectProof,
} = require("../controllers/proofController");

router.post("/", protect, upload.array("files"), uploadProofs);
router.get("/project/:projectId", protect, getProjectProof);

module.exports = router;

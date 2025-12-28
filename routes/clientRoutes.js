const express = require("express");
const router = express.Router();

const {
  getProjectByToken,
  submitFeedback,
  submitBulkFeedback,
} = require("../controllers/clientController");

router.get("/shared/:token", getProjectByToken);
router.put("/feedback/:proofId", submitFeedback);
router.put("/bulk-feedback/:projectId", submitBulkFeedback);

module.exports = router;

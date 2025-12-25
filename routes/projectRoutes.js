const express = require("express");
const router = express.Router();
const {
  createProject,
  getFreelancerProjects,
  getProjectById,
  updateProjectStatus,
} = require("../controllers/project_Controller.js");
const { protect } = require("../middleware/authMiddleware.js");

router
  .route("/")
  .post(protect, createProject)
  .get(protect, getFreelancerProjects);

router
  .route("/:id")
  .get(protect, getProjectById)
  .put(protect, updateProjectStatus);

module.exports = router;
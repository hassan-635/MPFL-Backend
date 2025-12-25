const Project = require("../models/Project");
const crypto = require("crypto");

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const shareableToken = crypto.randomBytes(16).toString("hex");

    const project = await Project.create({
      freelancer: req.user._id,
      title,
      description,
      shareableToken,
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFreelancerProjects = async (req, res) => {
  try {
    const projects = await Project.find({ freelancer: req.user._id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      freelancer: req.user._id,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const project = project.findOneAndUpdate(
      {
        _id: req.params.id,
        freelancer: req.user._id,
      },
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

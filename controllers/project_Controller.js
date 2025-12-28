const Project = require("../models/Project");
const crypto = require("crypto");
const Proof = require("../models/Proof");

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
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        freelancer: req.user._id,
      },
      { status },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.find({ freelancer: req.user._id });
    const stats = {
      totalProjects: projects.length,
      pendingProjects: projects.filter((p) => p.status === "pending").length,
      completedProjects: projects.filter((p) => p.status === "completed")
        .length,
      awaitingFeedback: projects.filter((p) => p.status === "in-progress")
        .length,
    };
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectByToken = async (req, res) => {
  try {
    const { shareableToken } = req.params;
    const project = await Project.findOne({ shareableToken: shareableToken });
    if (!project) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }
    const proofs = await Proof.find({ project: project._id });
    res.status(200).json({
      ...project._doc, 
      proofs: proofs   
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleFeedback = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { comment, decision, status } = req.body;

    // 1. Project update karein (Status change)
    const project = await Project.findByIdAndUpdate(
      projectId, 
      { status: status }, 
      { new: true }
    );

    // 2. Proof update karein (Latest feedback save karein)
    // Aap Proof model mein last feedback save kar sakte hain
    await Proof.updateMany({ project: projectId }, { 
      clientFeedback: { comment, decision, date: new Date() } 
    });

    res.status(200).json({ message: "Feedback saved", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
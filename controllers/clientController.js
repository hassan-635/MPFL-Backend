const Project = require("../models/Project");
const Proof = require("../models/Proof");

exports.getProjectByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const project = await Project.findOne({ shareableToken: token });
    if (!project) {
      return res.status(404).json({ message: "Invalid link" });
    }
    const proofs = await Proof.find({ project: project._id });
    console.log("Project ID:", project._id);
    console.log("Proofs found:", proofs.length);
    res.status(200).json({ project, proofs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { proofId } = req.params;
    const { clientFeedback } = req.body;

    const updateFields = {};
    if (clientFeedback.name)
      updateFields["clientFeedback.name"] = clientFeedback.name;
    if (clientFeedback.email)
      updateFields["clientFeedback.email"] = clientFeedback.email;
    if (clientFeedback.comment)
      updateFields["clientFeedback.comment"] = clientFeedback.comment;
    if (clientFeedback.decision)
      updateFields["clientFeedback.decision"] = clientFeedback.decision;
    updateFields["reviewedAt"] = new Date();

    const proof = await Proof.findByIdAndUpdate(
      proofId,
      { $set: updateFields },
      { new: true }
    );

    if (!proof) {
      return res.status(404).json({ message: "Proof not found" });
    }

    res.status(200).json(proof);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitBulkFeedback = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { clientFeedback } = req.body;

    if (!clientFeedback || !clientFeedback.decision) {
      return res.status(400).json({
        message: "Decision (Accept/Reject) is required for bulk feedback",
      });
    }
    const feedbackObject = {
      name: clientFeedback.name || "",
      email: clientFeedback.email || "",
      comment: clientFeedback.comment || "",
      decision: clientFeedback.decision,
    };

    const result = await Proof.updateMany(
      { project: projectId },
      {
        $set: {
          clientFeedback: feedbackObject,
          reviewedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "No proofs found for this project" });
    }

    res.status(200).json({
      message: `${result.modifiedCount} proof(s) updated successfully`,
      decision: clientFeedback.decision,
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

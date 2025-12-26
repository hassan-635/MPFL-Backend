const Project = require("../models/Project");
const Proof = require("../models/Proof");
const sendEmail = require("../utils/sendEmail");

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
    ).populate({
      path: "project",
      populate: {
        path: "freelancer",
      },
    });

    if (!proof) {
      return res.status(404).json({ message: "Proof not found" });
    }

    await sendEmail({
      email: proof.project.freelancer.email,
      subject: `Feedback on ${proof.project.title}`,
      message: `<h3>Single File Feedback</h3>
                      <p>Client reviewed a file in <b>${proof.project.title}</b>.</p>
                      <p>Decision: <b>${clientFeedback.decision}</b></p>
                      <p>Comment: ${clientFeedback.comment}</p>`,
    });

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

    const project = await Project.findById(projectId).populate("freelancer");

    if (clientFeedback.decision === "Accepted") {
      await Project.findByIdAndUpdate(projectId, { status: "completed" });
    } else if (clientFeedback.decision === "Rejected") {
      await Project.findByIdAndUpdate(projectId, { status: "in-progress" });
    }
    // Email to Freelancer
    await sendEmail({
      email: project.freelancer.email,
      subject: `Bulk Feedback: ${project.title}`,
      message: `<h3>Project Update (Bulk)</h3>
                    <p>Client has given feedback on all files of <b>${project.title}</b>.</p>
                    <p>Overall Decision: <b>${clientFeedback.decision}</b></p>
                    <p>General Comment: ${clientFeedback.comment}</p>`,
    });

    res
      .status(200)
      .json({ message: "Bulk feedback saved and Freelancer notified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

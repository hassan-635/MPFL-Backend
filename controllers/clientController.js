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
    const { clientFeedback } = req.body; // Frontend se ye object aayega

    if (!clientFeedback || !clientFeedback.decision) {
      return res.status(400).json({
        message: "Decision (Accepted/Rejected) is required",
      });
    }

    // 1. Saare proofs ko update karein
    const result = await Proof.updateMany(
      { project: projectId },
      {
        $set: {
          clientFeedback: {
            name: clientFeedback.name || "Client",
            email: clientFeedback.email || "",
            comment: clientFeedback.comment || "",
            decision: clientFeedback.decision, // "Accepted" ya "Rejected"
          },
          reviewedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No proofs found" });
    }

    // 2. Project Status Update (Spelling ka dhyan rakhein)
    if (clientFeedback.decision === "Accepted") {
      await Project.findByIdAndUpdate(projectId, { status: "completed" }); // Permanently Completed
    } else if (clientFeedback.decision === "Rejected") {
      await Project.findByIdAndUpdate(projectId, { status: "pending" }); // Wapas pending
    }

    // 3. Freelancer ko notify karein
    const project = await Project.findById(projectId).populate("freelancer");
    sendEmail({
      email: project.freelancer.email,
      subject: `Project Update: ${project.title}`,
      message: `Project has been ${clientFeedback.decision}. Comment: ${clientFeedback.comment}`,
    });

    res.status(200).json({ message: "Feedback saved and status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
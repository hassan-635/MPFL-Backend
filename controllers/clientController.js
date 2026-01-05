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
    if (clientFeedback.name) updateFields["clientFeedback.name"] = clientFeedback.name;
    if (clientFeedback.email) updateFields["clientFeedback.email"] = clientFeedback.email;
    if (clientFeedback.comment) updateFields["clientFeedback.comment"] = clientFeedback.comment;
    if (clientFeedback.decision) updateFields["clientFeedback.decision"] = clientFeedback.decision;
    updateFields["reviewedAt"] = new Date();

    const proof = await Proof.findByIdAndUpdate(
      proofId,
      { $set: updateFields },
      { new: true }
    ).populate({
      path: "project",
      populate: { path: "freelancer" },
    });

    if (!proof) {
      return res.status(404).json({ message: "Proof not found" });
    }

    // RESEND LOGIC: Notification for Freelancer (Single File)
    await sendEmail({
      email: proof.project.freelancer.email,
      subject: `Feedback Received: ${proof.project.title}`,
      message: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Hello ${proof.project.freelancer.name},</h2>
          <p>The client has reviewed one of your files in project <b>${proof.project.title}</b>.</p>
          <div style="border-left: 5px solid #007bff; padding: 10px; background: #f9f9f9;">
            <p><b>Decision:</b> ${clientFeedback.decision}</p>
            <p><b>Comment:</b> ${clientFeedback.comment || "No comment provided."}</p>
          </div>
          <p>Please check your dashboard for details.</p>
        </div>
      `,
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
      return res.status(400).json({ message: "Decision (Accepted/Rejected) is required" });
    }

    const result = await Proof.updateMany(
      { project: projectId },
      {
        $set: {
          clientFeedback: {
            name: clientFeedback.name || "Client",
            email: clientFeedback.email || "",
            comment: clientFeedback.comment || "",
            decision: clientFeedback.decision,
          },
          reviewedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No proofs found" });
    }

    if (clientFeedback.decision === "Accepted") {
      await Project.findByIdAndUpdate(projectId, { status: "completed" });
    } else if (clientFeedback.decision === "Rejected") {
      await Project.findByIdAndUpdate(projectId, { status: "pending" });
    }

    // RESEND LOGIC: Notification for Freelancer (Bulk/Project Level)
    const project = await Project.findById(projectId).populate("freelancer");
    
    await sendEmail({
      email: project.freelancer.email,
      subject: `Final Decision: ${project.title}`,
      message: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Hello ${project.freelancer.name},</h2>
          <p>The client has made a final decision on your project <b>${project.title}</b>.</p>
          <p>Overall Status: <b style="color: ${clientFeedback.decision === 'Accepted' ? 'green' : 'red'};">
            ${clientFeedback.decision}
          </b></p>
          <p><b>Client's Closing Comment:</b><br>${clientFeedback.comment || "No additional comments."}</p>
          <p>Login to your portal to see next steps.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Feedback saved and status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
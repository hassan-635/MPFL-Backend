const Proof = require("../models/Proof");
const sendEmail = require("../utils/sendEmail");
const Project = require("../models/Project");

exports.uploadProofs = async (req, res) => {
  // files upload
  try {
    const { projectId, clientEmail } = req.body;
    if (!req.files || req.files === 0) {
      return res.status(400).json({
        message: "Please upload atleast one file",
      });
    }
    const proofPromises = req.files.map((file) => {
      return Proof.create({
        project: projectId,
        fileUrl: file.path,
        fileType: file.mimetype,
      });
    });
    // send email
    const project = await Project.findById(projectId);
    // Note: If you have a frontend, this should point to the frontend's view page (e.g., port 3000)
    // For now, we point to the backend API so you can confirm the data is available
    const shareLink = `https://mpfl-backend.onrender.com/api/v1/client/shared/${project.shareableToken}`;

    sendEmail({
      email: clientEmail,
      type: "submission", // Yeh n8n ko batayega ke submission hui hai
      token: project.shareableToken, // Backend generated token
      name: "Client", // Client ka naam ya generic
      subject: "Project Delivery: Files Ready for Review", // Optional, AI bhi generate kar sakta hai
    }).then((result) => {
      if (result.success) {
        console.log("n8n: Client notified via AI email.");
      } else {
        console.log("n8n: Email failed:", result.error);
      }
    });

    const savedProof = await Promise.all(proofPromises);

    // Update project status to in-progress
    await Project.findByIdAndUpdate(projectId, { status: "in-progress" });

    return res.status(200).json({
      message: `Files uploaded successfully! Client is being notified.`,
      proofs: savedProof,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getProjectProof = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ message: "Project Id is required" });
    }
    const proofs = await Proof.find({ project: projectId });

    // YAHAN CHANGE HAI:
    // Pehle aap { proofs } bhej rahe thay, ab direct proofs bhejain
    return res.status(200).json(proofs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

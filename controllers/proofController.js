const Proof = require("../models/Proof");
const sendEmail = require("../utils/sendEmail");
const Project = require("../models/Project");

exports.uploadProofs = async (req, res) => {
  try {
    const { projectId, clientEmail } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one file",
      });
    }

    const proofPromises = req.files.map((file) => {
      return Proof.create({
        project: projectId,
        fileUrl: file.path,
        fileType: file.mimetype,
      });
    });

    const project = await Project.findById(projectId);
    
    // Yahan wo link banayein jo client ne open karna hai
    const shareLink = `https://mpfl-backend.onrender.com/api/v1/client/shared/${project.shareableToken}`;

    // RESEND LOGIC: Yahan hum HTML message khud bhej rahe hain
    sendEmail({
      email: clientEmail,
      subject: "Project Delivery: Your Files are Ready!",
      message: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Hello Client,</h2>
          <p>Your freelancer has uploaded the project files for <b>${project.title}</b>.</p>
          <p>You can review the work and provide feedback using the secure link below:</p>
          <a href="${shareLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Project Now</a>
          <p><b>Access Token:</b> ${project.shareableToken}</p>
          <br>
          <p>Regards,<br>MPFL Team</p>
        </div>
      `,
    }).then((result) => {
      if (result.success) {
        console.log("Resend: Client notified successfully.");
      } else {
        console.log("Resend: Email failed:", result.error);
      }
    });

    const savedProof = await Promise.all(proofPromises);
    await Project.findByIdAndUpdate(projectId, { status: "in-progress" });

    return res.status(200).json({
      message: `Files uploaded successfully! Client is being notified via Resend.`,
      proofs: savedProof,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

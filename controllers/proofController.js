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
    const shareLink = `http://localhost:3001/api/v1/client/shared/${project.shareableToken}`;

    await sendEmail({
      email: clientEmail,
      subject: "Project Delivery: Files Ready for Review",
      message: `<h1>Hello Client,</h1>
                      <p>Freelancer has uploaded new files for project: <b>${project.title}</b></p>
                      <p>Review here: <a href="${shareLink}">${shareLink}</a></p>`,
    });

    const savedProof = await Promise.all(proofPromises);
    return res.status(200).json({
      message: `${savedProof.length} proofs uploaded successfully and Client notified`,
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
      return res.status(400).json({
        message: "Project Id is required",
      });
    }
    const proofs = await Proof.find({ project: projectId });
    if (!proofs) {
      return res.status(404).json({
        message: "Proof not found",
      });
    }
    return res.status(200).json({
      proofs,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

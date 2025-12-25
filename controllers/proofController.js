const Proof = require("../models/Proof");

exports.uploadProofs = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!req.files || req.files === 0) {
      return res.status(400).json({
        message: "Please upload atleast one file",
      });
    }
    const proofPromises = req.files.map((file) => {
      return Proof.create({
        project: projectId,
        fileUrl: file.path,
        fileType: file.mimetype
      });
    });
    const savedProof = await Promise.all(proofPromises);
    return res.status(200).json({
      message: `${savedProof.length} proofs uploaded successfully`,
      proofs: savedProof
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

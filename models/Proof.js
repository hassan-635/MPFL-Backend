const mongoose = require("mongoose");

const proofSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      requires: true,
    },
    fileUrl: {
      // cloudinary url
      type: String,
      required: [true, "Cloudinary file link is required"],
    },
    clientFeedback: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      comment: {
        type: String,
      },
      decision: {
        type: String,
        enum: ["Accept", "Reject", "Pending"],
        default: "Pending",
      },
    },
    reviwedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Proof", proofSchema);

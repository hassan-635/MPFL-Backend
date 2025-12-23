import mongoose from 'mongoose';

const proofSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        requires: true
    },
    fileUrl: { // cloudinary url
        type: String,
        required: [true, 'Cloudinary file link is required']
    },
    clientFeedback: {
        name: {
            type: String,
            required: [true, 'Client name required']
        },
        email: {
            type: String,
            required: [true, 'Client Email required']
        },
        comment: {
            type: String,
            required: [true, 'Please Provide Feedback...']
        },
        decision: {
            type: String,
            enum: ['Accept', 'Reject', 'Pending'],
            default: 'Pending'
        },
    },
    reviwedAt: {
        type: Date
    }
}, {
        timestamps: true
});

module.exports = mongoose.model('Proof', proofSchema);
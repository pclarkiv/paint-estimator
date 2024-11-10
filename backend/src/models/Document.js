// backend/src/models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['uploaded', 'processing', 'analyzed', 'failed'],
        default: 'uploaded'
    },
    analysisResults: {
        rooms: [{
            number: String,
            name: String,
            specifications: [{
                type: String,
                numberOfCoats: Number,
                surfaceType: String,
                preparationRequired: [String],
                estimatedCost: Number
            }]
        }],
        totalCost: {
            type: Number,
            default: 0
        },
        summary: {
            type: String
        }
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    processedAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
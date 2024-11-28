const mongoose = require('mongoose');

const blueprintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingError: {
    type: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  metadata: {
    dimensions: {
      width: Number,
      height: Number,
      unit: String
    },
    resolution: {
      dpi: Number
    },
    colorSpace: String,
    pageCount: Number
  },
  surfaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Surface'
  }],
  analysisStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  analysisResults: {
    totalArea: Number,
    surfaceCount: Number,
    detectedMaterials: [String],
    confidence: Number
  },
  virusScanStatus: {
    type: String,
    enum: ['pending', 'scanning', 'clean', 'infected'],
    default: 'pending'
  },
  virusScanResult: {
    scannedAt: Date,
    isClean: Boolean,
    threatDetails: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
blueprintSchema.index({ userId: 1, projectId: 1 });
blueprintSchema.index({ uploadStatus: 1 });
blueprintSchema.index({ analysisStatus: 1 });

// Virtual for public URL
blueprintSchema.virtual('publicUrl').get(function() {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${this.fileName}`;
});

// Methods
blueprintSchema.methods.updateUploadStatus = async function(status, error = null) {
  this.uploadStatus = status;
  if (status === 'completed') {
    this.processedAt = new Date();
  }
  if (error) {
    this.processingError = error;
  }
  return this.save();
};

blueprintSchema.methods.updateAnalysisStatus = async function(status, results = null) {
  this.analysisStatus = status;
  if (results) {
    this.analysisResults = results;
  }
  return this.save();
};

const Blueprint = mongoose.model('Blueprint', blueprintSchema);

module.exports = Blueprint;

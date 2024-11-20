// packages/server/src/models/Proposal.js
const proposalSchema = new mongoose.Schema({
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    version: {
      type: Number,
      default: 1
    },
    totalCost: {
      type: Number,
      required: true
    },
    treatments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Treatment'
    }],
    status: {
      type: String,
      enum: ['draft', 'final', 'approved', 'rejected'],
      default: 'draft'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = {
    Project: mongoose.model('Project', projectSchema),
    Surface: mongoose.model('Surface', surfaceSchema),
    Treatment: mongoose.model('Treatment', treatmentSchema),
    Proposal: mongoose.model('Proposal', proposalSchema)
  };
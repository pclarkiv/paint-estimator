// packages/server/src/models/Surface.js
const mongoose = require('mongoose');

const surfaceSchema = new mongoose.Schema({
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    blueprintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blueprint',
      required: true
    },
    areaNumber: {
      type: String,
      required: true
    },
    surfaceType: {
      type: String,
      enum: ['standard', 'cmu_block', 'masonry', 'concrete', 'drywall', 'wood', 'metal', 'special'],
      required: true
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true
    },
    material: {
      type: String,
      enum: ['concrete', 'brick', 'cmu', 'drywall', 'plaster', 'wood', 'metal', 'other'],
      required: true
    },
    treatmentType: {
      type: String,
      enum: ['primer', 'block_filler', 'masonry_primer', 'wood_primer', 'metal_primer', 'custom'],
      required: true
    },
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      area: { type: Number, required: true },
      unit: { type: String, enum: ['ft', 'm'], default: 'ft' }
    },
    location: {
      floor: Number,
      room: String,
      orientation: { type: String, enum: ['north', 'south', 'east', 'west', 'interior'] }
    },
    specialNotes: String,
    adjacentAreas: [{
      areaNumber: String,
      relationshipType: { type: String, enum: ['adjacent', 'above', 'below', 'connected'] }
    }],
    analysisConfidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    },
    surfacePreparation: [{
      type: { type: String, enum: ['cleaning', 'sanding', 'patching', 'priming', 'custom'] },
      description: String,
      estimatedTime: Number, // in hours
      materials: [{
        name: String,
        quantity: Number,
        unit: String
      }]
    }],
    environmentalFactors: {
      exposure: { type: String, enum: ['interior', 'exterior', 'semi-exposed'] },
      moisture: { type: String, enum: ['low', 'medium', 'high'] },
      temperature: { type: String, enum: ['controlled', 'variable', 'extreme'] }
    },
    costEstimates: {
      laborHours: Number,
      materialCost: Number,
      preparationCost: Number,
      totalCost: Number
    },
    status: {
      type: String,
      enum: ['detected', 'analyzed', 'verified', 'in_progress', 'completed'],
      default: 'detected'
    },
    lastAnalyzedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes for better query performance
surfaceSchema.index({ projectId: 1, blueprintId: 1 });
surfaceSchema.index({ projectId: 1, areaNumber: 1 }, { unique: true });
surfaceSchema.index({ status: 1 });

// Pre-save middleware to calculate area if not provided
surfaceSchema.pre('save', function(next) {
    if (!this.dimensions.area && this.dimensions.width && this.dimensions.height) {
        this.dimensions.area = this.dimensions.width * this.dimensions.height;
    }
    next();
});

// Method to update cost estimates
surfaceSchema.methods.updateCostEstimates = async function(rates) {
    const laborRate = rates.laborRate || 45; // Default labor rate per hour
    const preparationCost = this.surfacePreparation.reduce((total, prep) => {
        return total + (prep.estimatedTime * laborRate);
    }, 0);

    const materialCost = this.surfacePreparation.reduce((total, prep) => {
        return total + (prep.materials?.reduce((matTotal, mat) => matTotal + (mat.quantity || 0), 0) || 0);
    }, 0);

    this.costEstimates = {
        laborHours: this.surfacePreparation.reduce((total, prep) => total + (prep.estimatedTime || 0), 0),
        materialCost,
        preparationCost,
        totalCost: preparationCost + materialCost
    };

    return this.save();
};

// Method to add adjacent areas
surfaceSchema.methods.addAdjacentArea = async function(areaNumber, relationshipType) {
    if (!this.adjacentAreas.some(area => area.areaNumber === areaNumber)) {
        this.adjacentAreas.push({ areaNumber, relationshipType });
        return this.save();
    }
    return this;
};

const Surface = mongoose.model('Surface', surfaceSchema);

module.exports = Surface;
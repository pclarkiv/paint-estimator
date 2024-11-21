// packages/server/src/models/Treatment.js
const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
    surfaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Surface',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    steps: [{
      order: Number,
      description: String,
      material: String,
      coats: Number
    }],
    laborCost: {
      type: Number,
      required: true
    },
    materialCost: {
      type: Number,
      required: true
    }
});

module.exports = mongoose.model('Treatment', treatmentSchema);
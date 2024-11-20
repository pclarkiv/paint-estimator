// packages/server/src/models/Surface.js
const surfaceSchema = new mongoose.Schema({
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    areaNumber: {
      type: String,
      required: true
    },
    surfaceType: {
      type: String,
      enum: ['standard', 'cmu_block', 'masonry', 'special'],
      required: true
    },
    treatmentType: {
      type: String,
      enum: ['primer', 'block_filler', 'masonry_primer', 'custom'],
      required: true
    },
    dimensions: {
      width: Number,
      height: Number,
      area: Number
    },
    specialNotes: String,
    adjacentAreas: [{
      type: String  // Store adjacent area numbers
    }]
  });
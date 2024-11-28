const express = require('express');
const { body, param } = require('express-validator');
const blueprintController = require('../controllers/blueprintController');
const { authenticate } = require('../middleware/auth');
const validateRequest = require('../middleware/validators');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validate project ID
const validateProjectId = [
  param('projectId')
    .isMongoId()
    .withMessage('Invalid project ID')
];

// Validate blueprint upload request
const validateUploadRequest = [
  body('projectId')
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('fileType')
    .isString()
    .custom((value) => {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/tiff',
        'application/pdf',
        'image/webp'
      ];
      if (!allowedTypes.includes(value)) {
        throw new Error('Invalid file type');
      }
      return true;
    }),
  body('fileName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('File name is required'),
  body('fileSize')
    .isInt({ min: 1 })
    .withMessage('Invalid file size')
];

// Initiate file upload
router.post('/upload',
  validateUploadRequest,
  validateRequest,
  blueprintController.initiateUpload
);

// Confirm upload completion
router.post('/upload/:blueprintId/confirm',
  param('blueprintId').isMongoId(),
  validateRequest,
  blueprintController.confirmUpload
);

// Get upload status
router.get('/upload/:blueprintId/status',
  param('blueprintId').isMongoId(),
  validateRequest,
  blueprintController.getUploadStatus
);

// List blueprints for a project
router.get('/project/:projectId',
  validateProjectId,
  validateRequest,
  blueprintController.listBlueprints
);

// Delete a blueprint
router.delete('/:blueprintId',
  param('blueprintId').isMongoId(),
  validateRequest,
  blueprintController.deleteBlueprint
);

module.exports = router;

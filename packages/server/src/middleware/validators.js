// packages/server/src/middleware/validators.js

const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }
  next();
};

const validateProject = [
  body('name')
    .optional({ checkFalsy: true }) // Make it optional for updates
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters'),
  
  body('client')
    .optional({ checkFalsy: true }) // Make it optional for updates
    .isLength({ min: 1, max: 100 })
    .withMessage('Client name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),

  handleValidationErrors
];

// Separate validation for creation
const validateProjectCreation = [
  body('name')
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 100 })
    .withMessage('Project name must be less than 100 characters'),
  
  body('client')
    .notEmpty()
    .withMessage('Client name is required')
    .isLength({ max: 100 })
    .withMessage('Client name must be less than 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),

  handleValidationErrors
];

module.exports = {
  validateProject,
  validateProjectCreation
};
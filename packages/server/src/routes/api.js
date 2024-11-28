// packages/server/src/routes/api.js

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { validateProject, validateProjectCreation } = require('../middleware/validators');

// Project routes
router.post('/projects', validateProjectCreation, projectController.createProject);
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.put('/projects/:id', validateProject, projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

// Analysis routes
router.post('/projects/:id/analyze', projectController.analyzeBlueprint);
router.get('/projects/:id/analysis', projectController.getAnalysisResult);

module.exports = router;
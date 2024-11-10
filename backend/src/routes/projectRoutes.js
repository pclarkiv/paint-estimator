// backend/src/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    createProject,
    getProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

router.route('/')
    .get(getAllProjects)
    .post(createProject);

router.route('/:id')
    .get(getProject)
    .put(updateProject)
    .delete(deleteProject);

module.exports = router;
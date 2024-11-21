// packages/server/src/controllers/projectController.js

const ProjectService = require('../services/projectService');
const logger = require('../config/logger');

class ProjectController {
  async createProject(req, res) {
    try {
      const result = await ProjectService.createProjectFromBlueprint(req.body);
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Project creation failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create project',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getAllProjects(req, res) {
    try {
      const projects = await ProjectService.getAllProjects();
      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      logger.error('Failed to fetch projects:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects'
      });
    }
  }

  async getProjectById(req, res) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      logger.error(`Failed to fetch project ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project'
      });
    }
  }

  async updateProject(req, res) {
    try {
      // Check if request body is empty
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Update data is required'
        });
      }
  
      const project = await ProjectService.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
      
      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      logger.error(`Failed to update project ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to update project'
      });
    }
  }

  async deleteProject(req, res) {
    try {
      const result = await ProjectService.deleteProject(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      logger.error(`Failed to delete project ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete project'
      });
    }
  }

  async analyzeBlueprint(req, res) {
    try {
      const analysis = await ProjectService.analyzeBlueprint(
        req.params.id,
        req.body.blueprintData
      );
      if (!analysis) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      logger.error(`Blueprint analysis failed for project ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze blueprint'
      });
    }
  }

  async getAnalysisResult(req, res) {
    try {
      const result = await ProjectService.getAnalysisResult(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Analysis result not found'
        });
      }
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error(`Failed to fetch analysis for project ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analysis result'
      });
    }
  }
}

module.exports = new ProjectController();
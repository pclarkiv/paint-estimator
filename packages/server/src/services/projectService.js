// packages/server/src/services/projectService.js

const { Project } = require('../models');
const mongoose = require('mongoose');
const logger = require('../config/logger');

class ProjectService {
  async createProjectFromBlueprint(data, userId) {
    try {
      // Validate required fields
      if (!data.name || !data.client) {
        throw new Error('Missing required fields');
      }

      const project = await Project.create({
        name: data.name,
        client: data.client,
        description: data.description || '',
        createdBy: userId || new mongoose.Types.ObjectId(), // Fallback for testing
        status: 'draft'
      });

      return project;
    } catch (error) {
      logger.error('Project creation failed:', error);
      throw error;
    }
  }

  async getAllProjects() {
    try {
      return await Project.find({});
    } catch (error) {
      logger.error('Failed to fetch projects:', error);
      throw error;
    }
  }

  async getProjectById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      
      const project = await Project.findById(id);
      if (!project) {
        return null;
      }
      return project;
    } catch (error) {
      logger.error(`Failed to fetch project ${id}:`, error);
      throw error;
    }
  }

  async updateProject(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
  
      // First check if the project exists
      const exists = await Project.findById(id);
      if (!exists) {
        return null;
      }
  
      const project = await Project.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      return project;
    } catch (error) {
      logger.error(`Failed to update project ${id}:`, error);
      throw error;
    }
  }

  async deleteProject(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }

      const project = await Project.findByIdAndDelete(id);
      return project;
    } catch (error) {
      logger.error(`Failed to delete project ${id}:`, error);
      throw error;
    }
  }

  async analyzeBlueprint(projectId, blueprintData) {
    try {
      const project = await this.getProjectById(projectId);
      if (!project) {
        return null;
      }

      return {
        analysis: {
          projectId,
          surfaces: [],
          status: 'completed'
        }
      };
    } catch (error) {
      logger.error(`Blueprint analysis failed for project ${projectId}:`, error);
      throw error;
    }
  }

  async getAnalysisResult(projectId) {
    try {
      const project = await this.getProjectById(projectId);
      if (!project) {
        return null;
      }

      return {
        projectId,
        status: 'completed',
        results: {}
      };
    } catch (error) {
      logger.error(`Failed to fetch analysis for project ${projectId}:`, error);
      throw error;
    }
  }
}

module.exports = new ProjectService();
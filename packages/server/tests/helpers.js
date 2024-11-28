// packages/server/tests/helpers.js

const { Project } = require('../src/models');

const createTestProject = async (userData = {}) => {
  const defaultProject = {
    name: 'Test Project',
    client: 'Test Client',
    description: 'Test Description',
    status: 'draft',
    createdBy: '507f1f77bcf86cd799439011' // Dummy ObjectId
  };

  return await Project.create({
    ...defaultProject,
    ...userData
  });
};

module.exports = {
  createTestProject
};
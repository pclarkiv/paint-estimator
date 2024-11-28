// packages/server/tests/routes/project.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const { connect, clearDatabase, closeDatabase } = require('../setup');
const { createTestProject } = require('../helpers');
const app = require('../../src/index');

describe('Project Endpoints', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: 'New Project',
        client: 'John Doe',
        description: 'Test project description'
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', projectData.name);
      expect(response.body.data).toHaveProperty('client', projectData.client);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Project name is required'
          })
        ])
      );
    });
  });

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      // Create test projects
      await createTestProject({ name: 'Project 1' });
      await createTestProject({ name: 'Project 2' });

      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should return a project by id', async () => {
      const project = await createTestProject();

      const response = await request(app)
        .get(`/api/projects/${project._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id', project._id.toString());
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/projects/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update a project', async () => {
      const project = await createTestProject();
      const updateData = {
        name: 'Updated Project Name',
        client: 'Updated Client'
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('client', updateData.client);
    });

    it('should return 404 for non-existent project update', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/projects/${fakeId}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete a project', async () => {
      const project = await createTestProject();

      const response = await request(app)
        .delete(`/api/projects/${project._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Project deleted successfully');

      // Verify project is deleted
      const findResponse = await request(app)
        .get(`/api/projects/${project._id}`);
      expect(findResponse.status).toBe(404);
    });

    it('should return 404 for non-existent project deletion', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/projects/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/projects/:id/analyze', () => {
    it('should analyze blueprint for existing project', async () => {
      const project = await createTestProject();
      const blueprintData = {
        areas: [
          { number: '100', type: 'standard' },
          { number: '101', type: 'cmu_block' }
        ]
      };

      const response = await request(app)
        .post(`/api/projects/${project._id}/analyze`)
        .send({ blueprintData });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('analysis');
    });

    it('should return 404 for analyzing non-existent project', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/projects/${fakeId}/analyze`)
        .send({ blueprintData: {} });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/projects/:id/analysis', () => {
    it('should get analysis results for existing project', async () => {
      const project = await createTestProject();

      const response = await request(app)
        .get(`/api/projects/${project._id}/analysis`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('projectId');
      expect(response.body.data).toHaveProperty('status');
    });

    it('should return 404 for non-existent project analysis', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/projects/${fakeId}/analysis`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
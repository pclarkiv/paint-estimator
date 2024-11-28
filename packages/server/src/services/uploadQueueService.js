const Queue = require('bull');
const logger = require('../config/logger');

class UploadQueueService {
  constructor() {
    this.uploadQueue = new Queue('file-upload', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });

    // Process jobs
    this.uploadQueue.process(async (job) => {
      try {
        const { fileId, userId } = job.data;
        logger.info(`Processing upload job ${job.id} for file ${fileId}`);

        // TODO: Implement file processing logic here
        // - Virus scanning
        // - Image optimization
        // - Metadata extraction
        // - Blueprint analysis

        logger.info(`Upload job ${job.id} completed successfully`);
      } catch (error) {
        logger.error(`Error processing upload job ${job.id}:`, error);
        throw error;
      }
    });

    // Handle failed jobs
    this.uploadQueue.on('failed', (job, error) => {
      logger.error(`Job ${job.id} failed:`, error);
    });

    // Handle completed jobs
    this.uploadQueue.on('completed', (job) => {
      logger.info(`Job ${job.id} completed successfully`);
    });
  }

  async addToQueue(fileData) {
    try {
      const job = await this.uploadQueue.add(fileData, {
        priority: 1,
        timeout: 300000, // 5 minutes
      });
      
      logger.info(`Added file ${fileData.fileId} to upload queue, job ID: ${job.id}`);
      return job;
    } catch (error) {
      logger.error('Error adding to upload queue:', error);
      throw error;
    }
  }

  async getJobStatus(jobId) {
    try {
      const job = await this.uploadQueue.getJob(jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      const state = await job.getState();
      const progress = job._progress;
      
      return {
        id: job.id,
        state,
        progress,
        data: job.data,
        failedReason: job.failedReason,
      };
    } catch (error) {
      logger.error('Error getting job status:', error);
      throw error;
    }
  }

  async removeJob(jobId) {
    try {
      const job = await this.uploadQueue.getJob(jobId);
      if (job) {
        await job.remove();
        logger.info(`Job ${jobId} removed successfully`);
      }
    } catch (error) {
      logger.error('Error removing job:', error);
      throw error;
    }
  }
}

module.exports = new UploadQueueService();

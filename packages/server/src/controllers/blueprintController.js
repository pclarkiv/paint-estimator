const Blueprint = require('../models/Blueprint');
const s3Service = require('../services/s3Service');
const uploadQueueService = require('../services/uploadQueueService');
const logger = require('../config/logger');

class BlueprintController {
  async initiateUpload(req, res) {
    try {
      const { projectId, fileType, fileName, fileSize } = req.body;

      // Validate file size (e.g., 50MB limit)
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
      if (fileSize > MAX_FILE_SIZE) {
        return res.status(400).json({ error: 'File size exceeds limit of 50MB' });
      }

      // Generate presigned URL for S3 upload
      const { uploadUrl, fileName: s3FileName } = await s3Service.generatePresignedUrl(fileType);

      // Create blueprint record
      const blueprint = new Blueprint({
        userId: req.userId,
        projectId,
        fileName: s3FileName,
        originalName: fileName,
        fileType,
        fileSize,
        uploadStatus: 'pending'
      });

      await blueprint.save();

      res.status(200).json({
        uploadUrl,
        blueprintId: blueprint._id,
        fileName: s3FileName
      });
    } catch (error) {
      logger.error('Error initiating upload:', error);
      res.status(500).json({ error: 'Failed to initiate upload' });
    }
  }

  async confirmUpload(req, res) {
    try {
      const { blueprintId } = req.params;

      const blueprint = await Blueprint.findById(blueprintId);
      if (!blueprint) {
        return res.status(404).json({ error: 'Blueprint not found' });
      }

      // Update status and add to processing queue
      blueprint.uploadStatus = 'processing';
      await blueprint.save();

      const job = await uploadQueueService.addToQueue({
        fileId: blueprint._id,
        userId: req.userId,
        fileName: blueprint.fileName
      });

      res.status(200).json({
        message: 'Upload confirmed and processing started',
        jobId: job.id
      });
    } catch (error) {
      logger.error('Error confirming upload:', error);
      res.status(500).json({ error: 'Failed to confirm upload' });
    }
  }

  async getUploadStatus(req, res) {
    try {
      const { blueprintId } = req.params;

      const blueprint = await Blueprint.findById(blueprintId);
      if (!blueprint) {
        return res.status(404).json({ error: 'Blueprint not found' });
      }

      res.status(200).json({
        status: blueprint.uploadStatus,
        processingError: blueprint.processingError,
        metadata: blueprint.metadata,
        analysisStatus: blueprint.analysisStatus,
        analysisResults: blueprint.analysisResults,
        virusScanStatus: blueprint.virusScanStatus,
        virusScanResult: blueprint.virusScanResult
      });
    } catch (error) {
      logger.error('Error getting upload status:', error);
      res.status(500).json({ error: 'Failed to get upload status' });
    }
  }

  async listBlueprints(req, res) {
    try {
      const { projectId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const blueprints = await Blueprint.find({
        userId: req.userId,
        projectId
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-__v');

      const total = await Blueprint.countDocuments({
        userId: req.userId,
        projectId
      });

      res.status(200).json({
        blueprints,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      logger.error('Error listing blueprints:', error);
      res.status(500).json({ error: 'Failed to list blueprints' });
    }
  }

  async deleteBlueprint(req, res) {
    try {
      const { blueprintId } = req.params;

      const blueprint = await Blueprint.findOne({
        _id: blueprintId,
        userId: req.userId
      });

      if (!blueprint) {
        return res.status(404).json({ error: 'Blueprint not found' });
      }

      // Delete file from S3
      await s3Service.deleteFile(blueprint.fileName);

      // Delete blueprint record
      await blueprint.deleteOne();

      res.status(200).json({
        message: 'Blueprint deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting blueprint:', error);
      res.status(500).json({ error: 'Failed to delete blueprint' });
    }
  }
}

module.exports = new BlueprintController();

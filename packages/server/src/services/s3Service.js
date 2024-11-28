const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const cryptoRandomString = require('crypto-random-string');
const mime = require('mime-types');
const logger = require('../config/logger');

class S3Service {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET;
  }

  async generatePresignedUrl(fileType, folder = 'blueprints') {
    try {
      // Validate file type
      if (!this.isAllowedFileType(fileType)) {
        throw new Error('Invalid file type');
      }

      // Generate unique file name
      const extension = mime.extension(fileType);
      const fileName = `${folder}/${cryptoRandomString({ length: 24 })}.${extension}`;

      // Generate presigned URL
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        ContentType: fileType,
      });

      const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

      return {
        uploadUrl: presignedUrl,
        fileName: fileName,
      };
    } catch (error) {
      logger.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  async deleteFile(fileName) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
      });

      await this.s3Client.send(command);
      logger.info(`File deleted successfully: ${fileName}`);
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw error;
    }
  }

  isAllowedFileType(mimeType) {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/tiff',
      'application/pdf',
      'image/webp'
    ];
    return allowedTypes.includes(mimeType);
  }

  getPublicUrl(fileName) {
    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  }
}

module.exports = new S3Service();

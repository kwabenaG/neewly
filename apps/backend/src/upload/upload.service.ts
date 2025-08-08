import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    // Initialize AWS S3 if credentials are provided
    const awsAccessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const awsRegion = this.configService.get<string>('AWS_REGION');

    if (awsAccessKeyId && awsSecretAccessKey && awsRegion) {
      this.s3 = new AWS.S3({
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
        region: awsRegion,
      });
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general'): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only images are allowed.');
    }

    // If S3 is configured, upload to S3
    if (this.s3) {
      return await this.uploadToS3(file, folder);
    }

    // Otherwise, save locally
    return await this.saveLocally(file, folder);
  }

  private async uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const result = await this.s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      throw new BadRequestException('Failed to upload file to S3');
    }
  }

  private async saveLocally(file: Express.Multer.File, folder: string): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    try {
      fs.writeFileSync(filePath, file.buffer);
      return `/uploads/${folder}/${fileName}`;
    } catch (error) {
      throw new BadRequestException('Failed to save file locally');
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    // If it's an S3 URL, delete from S3
    if (fileUrl.includes('amazonaws.com') && this.s3) {
      await this.deleteFromS3(fileUrl);
    } else {
      // Delete local file
      await this.deleteLocally(fileUrl);
    }
  }

  private async deleteFromS3(fileUrl: string): Promise<void> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    const key = fileUrl.split('.com/')[1];

    try {
      await this.s3.deleteObject({
        Bucket: bucketName,
        Key: key,
      }).promise();
    } catch (error) {
      console.error('Failed to delete file from S3:', error);
    }
  }

  private async deleteLocally(fileUrl: string): Promise<void> {
    const filePath = path.join(process.cwd(), fileUrl.replace(/^\//, ''));
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Failed to delete local file:', error);
    }
  }
} 
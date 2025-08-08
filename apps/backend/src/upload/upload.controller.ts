import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image/:folder')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image file' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file type or no file provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileUrl = await this.uploadService.uploadFile(file, folder);
    
    return {
      success: true,
      fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  }

  @Post('avatar')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiResponse({ status: 201, description: 'Avatar uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file type or no file provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileUrl = await this.uploadService.uploadFile(file, 'avatars');
    
    return {
      success: true,
      fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  }

  @Post('event-banner')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload event banner image' })
  @ApiResponse({ status: 201, description: 'Banner uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file type or no file provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadEventBanner(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileUrl = await this.uploadService.uploadFile(file, 'event-banners');
    
    return {
      success: true,
      fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  }
} 
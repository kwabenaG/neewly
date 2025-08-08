import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a test email' })
  @ApiResponse({ status: 200, description: 'Test email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendTestEmail(@Body() body: { to: string; name: string }) {
    return await this.emailService.sendRsvpConfirmation(
      body.to,
      body.name,
      'Test Event',
      new Date(),
      'confirmed',
    );
  }
} 
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from './clerk-auth.guard';
import { User } from '../users/user.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.sub);
  }

  @Post('profile')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateProfile(req.user.sub, updateUserDto);
  }
} 
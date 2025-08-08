import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('rsvp')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get RSVP analytics for user events' })
  @ApiResponse({ status: 200, description: 'Analytics data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getRsvpAnalytics(@CurrentUser() user: any, @Query('days') days: string = '30') {
    return this.analyticsService.getRsvpAnalytics(user.sub, parseInt(days));
  }

  @Get('events/:eventId')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics for specific event' })
  @ApiResponse({ status: 200, description: 'Event analytics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getEventAnalytics(@CurrentUser() user: any, @Query('eventId') eventId: string) {
    return this.analyticsService.getEventAnalytics(user.sub, eventId);
  }
} 
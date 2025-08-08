import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.entity';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully', type: Event })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: any) {
    return this.eventsService.create(createEventDto, user.sub);
  }

  @Get()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all events for current user' })
  @ApiResponse({ status: 200, description: 'List of events', type: [Event] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: any) {
    return this.eventsService.findAll(user.sub);
  }

  @Get(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event found', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.findOne(id, user.sub);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get public event by slug' })
  @ApiResponse({ status: 200, description: 'Public event found', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findPublicBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: 200, description: 'Event updated successfully', type: Event })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @CurrentUser() user: any) {
    return this.eventsService.update(id, updateEventDto, user.sub);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.remove(id, user.sub);
  }

  @Post(':id/rsvp')
  @ApiOperation({ summary: 'Submit RSVP for event' })
  @ApiResponse({ status: 201, description: 'RSVP submitted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  submitRsvp(@Param('id') id: string, @Body() rsvpData: any) {
    return this.eventsService.submitRsvp(id, rsvpData);
  }
} 
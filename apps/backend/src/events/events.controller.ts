import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.entity';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully', type: Event })
  create(@Body() createEventDto: CreateEventDto, @Request() req: any) {
    // TODO: Get userId from JWT token
    const userId = req.user?.id || 'temp-user-id';
    return this.eventsService.create(createEventDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events for current user' })
  @ApiResponse({ status: 200, description: 'List of events', type: [Event] })
  findAll(@Request() req: any) {
    // TODO: Get userId from JWT token
    const userId = req.user?.id || 'temp-user-id';
    return this.eventsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event found', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id') id: string, @Request() req: any) {
    // TODO: Get userId from JWT token
    const userId = req.user?.id || 'temp-user-id';
    return this.eventsService.findOne(id, userId);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get public event by slug' })
  @ApiResponse({ status: 200, description: 'Public event found', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findPublicBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: 200, description: 'Event updated successfully', type: Event })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req: any) {
    // TODO: Get userId from JWT token
    const userId = req.user?.id || 'temp-user-id';
    return this.eventsService.update(id, updateEventDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  remove(@Param('id') id: string, @Request() req: any) {
    // TODO: Get userId from JWT token
    const userId = req.user?.id || 'temp-user-id';
    return this.eventsService.remove(id, userId);
  }
} 
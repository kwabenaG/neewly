import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest, GuestStatus } from './guest.entity';

@ApiTags('Guests')
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new guest' })
  @ApiResponse({ status: 201, description: 'Guest created successfully', type: Guest })
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(createGuestDto);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all guests for an event' })
  @ApiResponse({ status: 200, description: 'List of guests', type: [Guest] })
  findAll(@Param('eventId') eventId: string) {
    return this.guestsService.findAll(eventId);
  }

  @Get('event/:eventId/stats')
  @ApiOperation({ summary: 'Get event guest statistics' })
  @ApiResponse({ status: 200, description: 'Event statistics' })
  getEventStats(@Param('eventId') eventId: string) {
    return this.guestsService.getEventStats(eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get guest by ID' })
  @ApiResponse({ status: 200, description: 'Guest found', type: Guest })
  @ApiResponse({ status: 404, description: 'Guest not found' })
  findOne(@Param('id') id: string) {
    return this.guestsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update guest' })
  @ApiResponse({ status: 200, description: 'Guest updated successfully', type: Guest })
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestsService.update(id, updateGuestDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update guest status' })
  @ApiResponse({ status: 200, description: 'Guest status updated successfully', type: Guest })
  updateStatus(@Param('id') id: string, @Body('status') status: GuestStatus) {
    return this.guestsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete guest' })
  @ApiResponse({ status: 200, description: 'Guest deleted successfully' })
  remove(@Param('id') id: string) {
    return this.guestsService.remove(id);
  }
} 
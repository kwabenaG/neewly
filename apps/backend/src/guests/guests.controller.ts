import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest, GuestStatus } from './guest.entity';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@ApiTags('Guests')
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new guest' })
  @ApiResponse({ status: 201, description: 'Guest created successfully', type: Guest })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(createGuestDto);
  }

  @Post('rsvp')
  @ApiOperation({ summary: 'Public RSVP endpoint for guests' })
  @ApiResponse({ status: 201, description: 'RSVP submitted successfully', type: Guest })
  publicRsvp(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(createGuestDto);
  }

  @Get('event/:eventId')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all guests for an event' })
  @ApiResponse({ status: 200, description: 'List of guests', type: [Guest] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Param('eventId') eventId: string) {
    return this.guestsService.findAll(eventId);
  }

  @Get('event/:eventId/stats')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event guest statistics' })
  @ApiResponse({ status: 200, description: 'Event statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getEventStats(@Param('eventId') eventId: string) {
    return this.guestsService.getEventStats(eventId);
  }

  @Get('public/event/:eventId/stats')
  @ApiOperation({ summary: 'Get public event guest statistics' })
  @ApiResponse({ status: 200, description: 'Public event statistics' })
  getPublicEventStats(@Param('eventId') eventId: string) {
    return this.guestsService.getEventStats(eventId);
  }

  @Get(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get guest by ID' })
  @ApiResponse({ status: 200, description: 'Guest found', type: Guest })
  @ApiResponse({ status: 404, description: 'Guest not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.guestsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update guest' })
  @ApiResponse({ status: 200, description: 'Guest updated successfully', type: Guest })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestsService.update(id, updateGuestDto);
  }

  @Patch(':id/status')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update guest status' })
  @ApiResponse({ status: 200, description: 'Guest status updated successfully', type: Guest })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateStatus(@Param('id') id: string, @Body('status') status: GuestStatus) {
    return this.guestsService.updateStatus(id, status);
  }

  @Patch('public/:id/rsvp')
  @ApiOperation({ summary: 'Public RSVP status update' })
  @ApiResponse({ status: 200, description: 'RSVP status updated successfully', type: Guest })
  publicUpdateRsvp(@Param('id') id: string, @Body('status') status: GuestStatus) {
    return this.guestsService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete guest' })
  @ApiResponse({ status: 200, description: 'Guest deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.guestsService.remove(id);
  }

  @Post('import')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Import guests from CSV file' })
  @ApiResponse({ status: 201, description: 'Guests imported successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FileInterceptor('file'))
  importGuests(@UploadedFile() file: Express.Multer.File, @Body('eventId') eventId: string) {
    return this.guestsService.importFromCsv(file, eventId);
  }
} 
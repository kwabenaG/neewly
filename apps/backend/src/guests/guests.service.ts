import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest, GuestStatus } from './guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { EmailService } from '../email/email.service';
import { EventsService } from '../events/events.service';
import { EventsGateway } from '../events/events.gateway';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestsRepository: Repository<Guest>,
    private emailService: EmailService,
    private eventsService: EventsService,
    private eventsGateway: EventsGateway,
  ) {}

  async create(createGuestDto: CreateGuestDto): Promise<Guest> {
    const guest = this.guestsRepository.create(createGuestDto);
    const savedGuest = await this.guestsRepository.save(guest);
    
    // Get event details for email notification
    const event = await this.eventsService.findOne(createGuestDto.eventId, '');
    
    // Send invitation email if guest has email
    if (savedGuest.email && event) {
      await this.emailService.sendEventInvitation(
        savedGuest.email,
        savedGuest.name,
        event.title,
        event.eventDate,
        event.slug,
        'Event Host', // TODO: Get actual host name
      );
    }

    // Broadcast new guest to WebSocket clients
    this.eventsGateway.broadcastNewGuest(createGuestDto.eventId, savedGuest);
    
    return savedGuest;
  }

  async findAll(eventId: string): Promise<Guest[]> {
    return await this.guestsRepository.find({
      where: { eventId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Guest> {
    const guest = await this.guestsRepository.findOne({ where: { id } });
    if (!guest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }
    return guest;
  }

  async update(id: string, updateGuestDto: UpdateGuestDto): Promise<Guest> {
    const guest = await this.findOne(id);
    Object.assign(guest, updateGuestDto);
    const updatedGuest = await this.guestsRepository.save(guest);
    
    // Broadcast update to WebSocket clients
    this.eventsGateway.broadcastRsvpUpdate(guest.eventId, updatedGuest);
    
    return updatedGuest;
  }

  async remove(id: string): Promise<void> {
    const guest = await this.findOne(id);
    await this.guestsRepository.remove(guest);
    
    // Broadcast removal to WebSocket clients
    this.eventsGateway.broadcastRsvpUpdate(guest.eventId, { id: guest.id, deleted: true });
  }

  async updateStatus(id: string, status: GuestStatus): Promise<Guest> {
    const guest = await this.findOne(id);
    guest.status = status;
    const updatedGuest = await this.guestsRepository.save(guest);
    
    // Send confirmation email if guest has email
    if (updatedGuest.email && (status === GuestStatus.CONFIRMED || status === GuestStatus.DECLINED)) {
      const event = await this.eventsService.findOne(updatedGuest.eventId, '');
      if (event) {
        await this.emailService.sendRsvpConfirmation(
          updatedGuest.email,
          updatedGuest.name,
          event.title,
          event.eventDate,
          status === GuestStatus.CONFIRMED ? 'confirmed' : 'declined',
        );
      }
    }
    
    // Broadcast status update to WebSocket clients
    this.eventsGateway.broadcastRsvpUpdate(guest.eventId, updatedGuest);
    
    // Broadcast guest count update
    const stats = await this.getEventStats(guest.eventId);
    this.eventsGateway.broadcastGuestCountUpdate(guest.eventId, stats);
    
    return updatedGuest;
  }

  async getEventStats(eventId: string) {
    const guests = await this.findAll(eventId);
    const totalGuests = guests.reduce((sum, guest) => sum + guest.numberOfGuests, 0);
    const confirmedGuests = guests
      .filter(guest => guest.status === GuestStatus.CONFIRMED)
      .reduce((sum, guest) => sum + guest.numberOfGuests, 0);
    const declinedGuests = guests
      .filter(guest => guest.status === GuestStatus.DECLINED)
      .reduce((sum, guest) => sum + guest.numberOfGuests, 0);
    const pendingGuests = guests
      .filter(guest => guest.status === GuestStatus.PENDING)
      .reduce((sum, guest) => sum + guest.numberOfGuests, 0);

    return {
      totalGuests,
      confirmedGuests,
      declinedGuests,
      pendingGuests,
      totalInvitations: guests.length,
    };
  }

  async importFromCsv(file: Express.Multer.File, eventId: string): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.includes('csv') && !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File must be a CSV');
    }

    const results: any[] = [];
    const stream = Readable.from(file.buffer);
    
    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            const importedGuests = [];
            const errors = [];

            for (const row of results) {
              try {
                // Validate required fields
                if (!row.Name || !row.Email) {
                  errors.push(`Row missing required fields: ${JSON.stringify(row)}`);
                  continue;
                }

                const guestData = {
                  name: row.Name.trim(),
                  email: row.Email.trim(),
                  phone: row.Phone ? row.Phone.trim() : null,
                  numberOfGuests: row.NumberOfGuests ? parseInt(row.NumberOfGuests) : 1,
                  mealPreference: row.MealPreference ? row.MealPreference.trim() : null,
                  notes: row.Notes ? row.Notes.trim() : null,
                  eventId: eventId,
                  status: GuestStatus.PENDING,
                };

                const guest = await this.create(guestData);
                importedGuests.push(guest);
              } catch (error) {
                errors.push(`Error importing row: ${JSON.stringify(row)} - ${error.message}`);
              }
            }

            resolve({
              success: true,
              imported: importedGuests.length,
              errors: errors.length,
              errorDetails: errors,
            });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(new BadRequestException('Error parsing CSV file'));
        });
    });
  }
} 
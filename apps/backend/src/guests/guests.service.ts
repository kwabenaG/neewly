import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest, GuestStatus } from './guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestsRepository: Repository<Guest>,
  ) {}

  async create(createGuestDto: CreateGuestDto): Promise<Guest> {
    const guest = this.guestsRepository.create(createGuestDto);
    return await this.guestsRepository.save(guest);
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
    return await this.guestsRepository.save(guest);
  }

  async remove(id: string): Promise<void> {
    const guest = await this.findOne(id);
    await this.guestsRepository.remove(guest);
  }

  async updateStatus(id: string, status: GuestStatus): Promise<Guest> {
    const guest = await this.findOne(id);
    guest.status = status;
    return await this.guestsRepository.save(guest);
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
} 
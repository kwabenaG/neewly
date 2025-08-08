import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto, userId: string): Promise<Event> {
    const event = this.eventsRepository.create({
      ...createEventDto,
      userId,
    });
    return await this.eventsRepository.save(event);
  }

  async findAll(userId: string): Promise<Event[]> {
    return await this.eventsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id, userId },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async findBySlug(slug: string): Promise<Event | null> {
    return await this.eventsRepository.findOne({
      where: { slug, isPublic: true },
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string): Promise<Event> {
    const event = await this.findOne(id, userId);
    Object.assign(event, updateEventDto);
    return await this.eventsRepository.save(event);
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.findOne(id, userId);
    await this.eventsRepository.remove(event);
  }

  async updateStatus(id: string, status: EventStatus, userId: string): Promise<Event> {
    const event = await this.findOne(id, userId);
    event.status = status;
    return await this.eventsRepository.save(event);
  }
} 
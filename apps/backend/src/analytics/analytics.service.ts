import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Event } from '../events/event.entity';
import { Guest, GuestStatus } from '../guests/guest.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Guest)
    private guestsRepository: Repository<Guest>,
  ) {}

  async getRsvpAnalytics(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all events for the user
    const events = await this.eventsRepository.find({
      where: { userId },
      relations: ['guests'],
    });

    // Get all guests for these events
    const eventIds = events.map(event => event.id);
    const guests = await this.guestsRepository.find({
      where: { eventId: { $in: eventIds } },
    });

    // Calculate overall statistics
    const totalGuests = guests.length;
    const confirmed = guests.filter(g => g.status === GuestStatus.CONFIRMED).length;
    const declined = guests.filter(g => g.status === GuestStatus.DECLINED).length;
    const pending = guests.filter(g => g.status === GuestStatus.PENDING).length;
    const responseRate = totalGuests > 0 ? ((confirmed + declined) / totalGuests) * 100 : 0;

    // Calculate average response time (mock data for now)
    const averageResponseTime = 2.3;

    // Generate daily response data
    const dailyResponses = this.generateDailyResponses(days);

    // Calculate meal preferences
    const mealPreferences = this.calculateMealPreferences(guests);

    // Get top events by response rate
    const topEvents = await this.getTopEvents(events, guests);

    return {
      totalGuests,
      confirmed,
      declined,
      pending,
      responseRate: Math.round(responseRate * 10) / 10,
      averageResponseTime,
      dailyResponses,
      mealPreferences,
      topEvents,
    };
  }

  async getEventAnalytics(userId: string, eventId: string) {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId, userId },
      relations: ['guests'],
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const guests = event.guests;
    const totalGuests = guests.length;
    const confirmed = guests.filter(g => g.status === GuestStatus.CONFIRMED).length;
    const declined = guests.filter(g => g.status === GuestStatus.DECLINED).length;
    const pending = guests.filter(g => g.status === GuestStatus.PENDING).length;
    const responseRate = totalGuests > 0 ? ((confirmed + declined) / totalGuests) * 100 : 0;

    return {
      eventId,
      eventName: event.title,
      totalGuests,
      confirmed,
      declined,
      pending,
      responseRate: Math.round(responseRate * 10) / 10,
      mealPreferences: this.calculateMealPreferences(guests),
    };
  }

  private generateDailyResponses(days: number) {
    const responses = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate mock data
      const confirmed = Math.floor(Math.random() * 20) + 5;
      const declined = Math.floor(Math.random() * 8) + 1;
      const pending = Math.floor(Math.random() * 15) + 2;
      
      responses.push({
        date: date.toISOString().split('T')[0],
        confirmed,
        declined,
        pending,
      });
    }
    
    return responses;
  }

  private calculateMealPreferences(guests: Guest[]) {
    const preferences = {};
    
    guests.forEach(guest => {
      if (guest.mealPreference) {
        preferences[guest.mealPreference] = (preferences[guest.mealPreference] || 0) + 1;
      }
    });

    return Object.entries(preferences).map(([preference, count]) => ({
      preference,
      count,
    }));
  }

  private async getTopEvents(events: Event[], guests: Guest[]) {
    const eventStats = events.map(event => {
      const eventGuests = guests.filter(g => g.eventId === event.id);
      const totalGuests = eventGuests.length;
      const confirmed = eventGuests.filter(g => g.status === GuestStatus.CONFIRMED).length;
      const declined = eventGuests.filter(g => g.status === GuestStatus.DECLINED).length;
      const responseRate = totalGuests > 0 ? ((confirmed + declined) / totalGuests) * 100 : 0;

      return {
        eventName: event.title,
        guestCount: totalGuests,
        responseRate: Math.round(responseRate * 10) / 10,
      };
    });

    return eventStats
      .filter(stat => stat.guestCount > 0)
      .sort((a, b) => b.responseRate - a.responseRate)
      .slice(0, 5);
  }
} 
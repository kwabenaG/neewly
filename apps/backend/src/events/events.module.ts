import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsGateway } from './events.gateway';
import { Event } from './event.entity';
import { GuestsModule } from '../guests/guests.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), GuestsModule],
  providers: [EventsService, EventsGateway],
  controllers: [EventsController],
  exports: [EventsService, EventsGateway],
})
export class EventsModule {} 
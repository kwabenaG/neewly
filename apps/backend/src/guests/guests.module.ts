import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { Guest } from './guest.entity';
import { EmailModule } from '../email/email.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guest]),
    EmailModule,
    EventsModule,
  ],
  providers: [GuestsService],
  controllers: [GuestsController],
  exports: [GuestsService],
})
export class GuestsModule {} 
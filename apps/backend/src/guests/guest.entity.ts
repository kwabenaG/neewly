import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Event } from '../events/event.entity';

export enum GuestStatus {
  INVITED = 'invited',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
  PENDING = 'pending',
}

@Entity('guests')
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ default: 1 })
  numberOfGuests: number;

  @Column({
    type: 'enum',
    enum: GuestStatus,
    default: GuestStatus.INVITED,
  })
  status: GuestStatus;

  @Column({ nullable: true })
  mealPreference?: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ type: 'jsonb', nullable: true })
  additionalInfo?: any;

  @ManyToOne(() => Event, event => event.guests)
  event: Event;

  @Column()
  eventId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 
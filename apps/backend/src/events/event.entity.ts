import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Guest } from '../guests/guest.entity';

export enum EventStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column({ nullable: true })
  venue?: string;

  @Column({ nullable: true })
  venueAddress?: string;

  @Column({ nullable: true })
  bannerImage?: string;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @Column({ unique: true })
  slug: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: 50 })
  guestLimit: number;

  @Column({ type: 'jsonb', nullable: true })
  theme?: any;

  @ManyToOne(() => User, user => user.events)
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Guest, guest => guest.event)
  guests: Guest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 
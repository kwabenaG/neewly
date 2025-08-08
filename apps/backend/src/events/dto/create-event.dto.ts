import { IsString, IsDateString, IsOptional, IsEnum, IsBoolean, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from '../event.entity';

export class CreateEventDto {
  @ApiProperty({ description: 'Event title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Event description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Event date' })
  @IsDateString()
  eventDate: string;

  @ApiProperty({ description: 'Event venue', required: false })
  @IsOptional()
  @IsString()
  venue?: string;

  @ApiProperty({ description: 'Event venue address', required: false })
  @IsOptional()
  @IsString()
  venueAddress?: string;

  @ApiProperty({ description: 'Event banner image URL', required: false })
  @IsOptional()
  @IsUrl()
  bannerImage?: string;

  @ApiProperty({ description: 'Event status', enum: EventStatus, default: EventStatus.DRAFT })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiProperty({ description: 'Unique event slug' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Is event public', default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ description: 'Guest limit', default: 50 })
  @IsOptional()
  @IsNumber()
  guestLimit?: number;

  @ApiProperty({ description: 'Event theme configuration', required: false })
  @IsOptional()
  theme?: any;
} 
import { IsString, IsEmail, IsOptional, IsNumber, IsEnum, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GuestStatus } from '../guest.entity';

export class CreateGuestDto {
  @ApiProperty({ description: 'Guest name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Guest email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Number of guests', default: 1 })
  @IsOptional()
  @IsNumber()
  numberOfGuests?: number;

  @ApiProperty({ description: 'Guest status', enum: GuestStatus, default: GuestStatus.INVITED })
  @IsOptional()
  @IsEnum(GuestStatus)
  status?: GuestStatus;

  @ApiProperty({ description: 'Meal preference', required: false })
  @IsOptional()
  @IsString()
  mealPreference?: string;

  @ApiProperty({ description: 'Message from guest', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: 'Additional information', required: false })
  @IsOptional()
  additionalInfo?: any;

  @ApiProperty({ description: 'Event ID' })
  @IsString()
  eventId: string;
} 
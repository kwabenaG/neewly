import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async validateUser(clerkId: string, email: string, firstName: string, lastName: string) {
    // Check if user exists in our database
    let user = await this.usersService.findByClerkId(clerkId);
    
    if (!user) {
      // Create new user if they don't exist
      const createUserDto: CreateUserDto = {
        email,
        firstName,
        lastName,
        clerkId,
        isEmailVerified: true, // Clerk handles email verification
      };
      user = await this.usersService.create(createUserDto);
    }
    
    return user;
  }

  async getProfile(clerkId: string) {
    const user = await this.usersService.findByClerkId(clerkId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async updateProfile(clerkId: string, updateData: Partial<CreateUserDto>) {
    const user = await this.usersService.findByClerkId(clerkId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return await this.usersService.update(user.id, updateData);
  }
} 
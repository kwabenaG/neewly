import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClerkAuthGuard } from './clerk-auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [ClerkAuthGuard, AuthService],
  controllers: [AuthController],
  exports: [ClerkAuthGuard, AuthService],
})
export class AuthModule {} 
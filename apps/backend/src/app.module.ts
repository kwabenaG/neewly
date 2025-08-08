import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { GuestsModule } from './guests/guests.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { EmailModule } from './email/email.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('SUPABASE_DB_URL'), // Supabase connection string
        ssl: { rejectUnauthorized: false }, // Required for Supabase
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        extra: {
          max: 20, // Connection pool size
          connectionTimeoutMillis: 5000,
          idleTimeoutMillis: 30000,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    EventsModule,
    GuestsModule,
    AuthModule,
    UploadModule,
    EmailModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 
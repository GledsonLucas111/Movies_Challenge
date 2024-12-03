import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MoviesModule } from './app/movies/movies.module';
import { RentalsModule } from './app/rentals/rentals.module';
import { AuthModule } from './app/auth/auth.module';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';
import { ReservationModule } from './app/reservation/reservation.module';

import { JwtAuthGuard } from './app/auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-store';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...AppDataSource.options, // configurações definidas no data-source
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@example.com>',
        },
      }),
    }),
    CacheModule.registerAsync<CacheModuleOptions>({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
          },
          ttl: configService.get<number>('REDIS_TTL', 600), // tempo de vida do cache
        }),
      }),
    }),
    UserModule,
    MoviesModule,
    RentalsModule,
    AuthModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

import { MoviesController } from './controllers/movies.controller';
import { Movie } from './entities/movie.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from '../user/user.module';

import { MoviesService } from './services/movies.service';
import { MoviesSyncService } from './cron/movie-sync.service';
import { MovieApiService } from './cron/movie-api.service';
import { CronService } from './cron/cron.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from './cron/mail.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Movie]),
    UserModule,
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    MoviesSyncService,
    MovieApiService,
    CronService,
    ConfigService,
    MailService,
  ],
  exports: [MoviesService, TypeOrmModule],
})
export class MoviesModule {}

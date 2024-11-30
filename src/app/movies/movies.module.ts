import { MoviesController } from './controllers/movies.controller';
import { Movie } from './entities/movie.entity';

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from '../user/user.module';

import { MoviesService } from './services/movies.service';
import { CronService } from './cron/cron.service';
import { ConfigService } from '@nestjs/config';
import { RentalsModule } from '../rentals/rentals.module';
import { ExternalServices } from './cron/external.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Movie]),
    UserModule,
    forwardRef(() => RentalsModule),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, CronService, ConfigService, ExternalServices],
  exports: [MoviesService, TypeOrmModule],
})
export class MoviesModule {}

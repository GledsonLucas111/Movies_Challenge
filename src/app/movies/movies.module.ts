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
import { PopularMoviesService } from './services/popular-movies.service';
import { PopularMoviesController } from './controllers/popular-movies.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Movie]),
    UserModule,
    forwardRef(() => RentalsModule),
  ],
  controllers: [MoviesController, PopularMoviesController],
  providers: [
    MoviesService,
    CronService,
    ConfigService,
    ExternalServices,
    PopularMoviesService,
  ],
  exports: [MoviesService, TypeOrmModule],
})
export class MoviesModule {}

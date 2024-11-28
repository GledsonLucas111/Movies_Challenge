import { Module } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { MoviesController } from './controllers/movies.controller';
import { Movie } from './entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MoviesSyncService } from './cron/movie-sync.service';
import { MovieApiService } from './cron/movie-api.service';
import { MoviesCronService } from './cron/movies-cro.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Movie])],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    MoviesSyncService,
    MovieApiService,
    MoviesCronService,
    ConfigService,
  ],
  exports: [MoviesService, TypeOrmModule],
})
export class MoviesModule {}

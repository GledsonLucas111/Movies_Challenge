import { forwardRef, Module } from '@nestjs/common';
import { RentalsService } from '../rentals/services/rentals.service';
import { RentalsController } from './controllers/rentals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rental]), forwardRef(() => MoviesModule)],
  controllers: [RentalsController],
  providers: [RentalsService],
  exports: [RentalsService, TypeOrmModule],
})
export class RentalsModule {}

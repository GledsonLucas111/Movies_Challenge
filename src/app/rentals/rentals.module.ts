import { Module } from '@nestjs/common';
import { RentalsService } from '../rentals/services/rentals.service';
import { RentalsController } from './controllers/rentals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rental])],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}

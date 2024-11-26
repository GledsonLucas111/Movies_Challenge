import { Module } from '@nestjs/common';
import { RentalsService } from '../rentals/services/rentals.service';
import { RentalsController } from './controllers/rentals.controller';

@Module({
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}

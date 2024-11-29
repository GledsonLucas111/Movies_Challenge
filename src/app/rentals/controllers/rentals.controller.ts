import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { RentalsService } from '../services/rentals.service';
import { CreateRentalDto } from '../dto/create-rental.dto';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  rentMovie(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalsService.rentMovie(createRentalDto);
  }

  @Get()
  findAll() {
    return this.rentalsService.finAll();
  }

  @Patch(':id')
  returnMovie(@Param(':id') id: number) {
    return this.rentalsService.returnMovie(id);
  }

  @Post()
  reservationMovie(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalsService.reservationMovie(createRentalDto);
  }
}

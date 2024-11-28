import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RentalsService } from '../services/rentals.service';
import { CreateRentalDto } from '../dto/create-rental.dto';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalsService.create(createRentalDto);
  }

  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rentalsService.findOne(+id);
  }
}

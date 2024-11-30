import { Controller, Post, Body, Get } from '@nestjs/common';
import { ReservationService } from '../services/reservation.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.createReservation(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }
}

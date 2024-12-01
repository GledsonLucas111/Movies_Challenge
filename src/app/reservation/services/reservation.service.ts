import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { Reservation } from '../entities/reservation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/app/movies/entities/movie.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(dto: CreateReservationDto) {
    const movie = await this.movieRepository.findOne({
      where: { id: dto.movieId },
    });
    if (!movie || movie.release_date <= new Date()) {
      throw new BadRequestException('Cannot reserve released movies');
    }

    const existingReservation = await this.reservationRepository.findOne({
      where: { userId: dto.userId, movieId: dto.movieId },
    });

    if (existingReservation) {
      throw new ConflictException('Reservation already exists');
    }

    const reservation = this.reservationRepository.create({
      userId: dto.userId,
      movieId: dto.movieId,
    });

    return this.reservationRepository.save(reservation);
  }

  async findAll() {
    return await this.reservationRepository.find();
  }
}

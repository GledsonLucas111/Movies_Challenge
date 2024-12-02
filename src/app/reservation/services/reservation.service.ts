import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { Reservation } from '../entities/reservation.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/app/movies/entities/movie.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateReservationDto) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const movie = await queryRunner.manager.findOne(Movie, {
        where: { id: dto.movieId },
      });
      if (!movie || movie.release_date <= new Date()) {
        throw new BadRequestException('Cannot reserve released movies');
      }

      const existingReservation = await queryRunner.manager.findOne(
        Reservation,
        {
          where: { userId: dto.userId, movieId: dto.movieId },
        },
      );

      if (existingReservation) {
        throw new ConflictException('Reservation already exists');
      }

      const reservation = queryRunner.manager.create(Reservation, {
        userId: dto.userId,
        movieId: dto.movieId,
      });

      const result = await queryRunner.manager.save(reservation);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.reservationRepository.find();
  }
}

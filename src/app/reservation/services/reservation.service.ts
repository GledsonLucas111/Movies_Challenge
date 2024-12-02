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
      // Verifica se o filme existe e se a data de lançamento é válida
      const movie = await queryRunner.manager.findOne(Movie, {
        where: { id: dto.movieId },
      });
      if (!movie || movie.release_date <= new Date()) {
        throw new BadRequestException('Cannot reserve released movies');
      }

      // Verifica se já existe uma reserva para este filme e usuário
      const existingReservation = await queryRunner.manager.findOne(
        Reservation,
        {
          where: { userId: dto.userId, movieId: dto.movieId },
        },
      );

      if (existingReservation) {
        throw new ConflictException('Reservation already exists');
      }

      // Obtem o repositório da entidade Reservation
      const reservationRepository =
        queryRunner.manager.getRepository(Reservation);

      // Cria a nova reserva usando o repositório
      const reservation = reservationRepository.create({
        userId: dto.userId,
        movieId: dto.movieId,
      });

      // Salva a nova reserva no banco de dados
      const result = await reservationRepository.save(reservation);

      // Commit da transação
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      // Rollback da transação em caso de erro
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Libera o QueryRunner
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.reservationRepository.find();
  }
}

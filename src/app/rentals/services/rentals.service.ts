import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRentalDto } from '../dto/create-rental.dto';
import { Rental } from '../entities/rental.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/app/movies/entities/movie.entity';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalsRepository: Repository<Rental>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateRentalDto) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { userId, movieId } = dto;
      // verifica quantos filmes o usuario ja alugou e nao devolveu
      const activeRentals = await queryRunner.manager.count(Rental, {
        where: { userId, isReturned: false },
      });
      if (activeRentals >= 3) {
        throw new BadRequestException(
          'You already mentioned the maximum number of 3 movies.',
        );
      }

      // verifica a disponibilidade do filme
      const movie = await queryRunner.manager.findOne(Movie, {
        where: { id: movieId },
      });
      if (!movie) {
        throw new BadRequestException('Movie not found.');
      }

      const releaseMovie = await queryRunner.manager.findOne(Movie, {
        where: {
          id: movieId,
        },
      });
      if (releaseMovie.release_date > new Date()) {
        throw new BadRequestException('Cannot reserve not released movies');
      }

      // muda o status do filme de false para true
      await this.movieRepository.update(movieId, { isRented: true });

      // verifica se o filme ja esta alugado
      if (movie.isRented) {
        throw new BadRequestException('Movie is already rented.');
      }
      // cria a locacao de um filme
      const rental = queryRunner.manager.create(Rental, {
        userId,
        movieId,
        rentalDate: new Date(),
        isReturned: false,
      });

      const result = await queryRunner.manager.save(rental);

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
    return await this.rentalsRepository.find();
  }

  async update(id: number) {
    const rental = await this.rentalsRepository.findOne({ where: { id } });
    const data = {
      returnDate: new Date(),
      isReturned: true,
    };

    // se nao encontrar o rental com o id passado eh dispardo um erro
    if (!rental) {
      throw new NotFoundException();
    }
    await this.movieRepository.update(rental.movieId, { isRented: false });

    Object.assign(rental, data);

    return await this.rentalsRepository.save(rental);
  }
}

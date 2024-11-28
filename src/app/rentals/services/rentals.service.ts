import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRentalDto } from '../dto/create-rental.dto';
import { Rental } from '../entities/rental.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/app/movies/entities/movie.entity';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private readonly rantalsRepository: Repository<Rental>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(dto: CreateRentalDto) {
    const { userId, movieId } = dto;

    // verifica quantos filmes o usuario ja alugou e nao devolveu
    const activeRentals = await this.rantalsRepository.count({
      where: { userId, isReturned: false },
    });
    if (activeRentals >= 3) {
      throw new BadRequestException(
        'You already mentioned the maximum number of 3 films.',
      );
    }

    // verifica a disponibilidade do filme
    const movie = await this.movieRepository.findOne({
      where: { id: Number(movieId) },
    });
    if (!movie) {
      throw new BadRequestException('Movie not found.');
    }

    // cria a locacao de um filme
    const rental = this.rantalsRepository.create({
      userId,
      movieId,
      rentalDate: new Date(),
      isReturned: false,
    });

    return await this.rantalsRepository.save(rental);
  }

  async findAll(): Promise<Rental[]> {
    return await this.rantalsRepository.find();
  }

  async findOne(id: number): Promise<Rental> {
    return await this.rantalsRepository.findOne({ where: { id } });
  }
}

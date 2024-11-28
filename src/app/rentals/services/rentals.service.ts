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
    private readonly rentalsRepository: Repository<Rental>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async rentMovie(dto: CreateRentalDto) {
    const { userId, movieId } = dto;

    // verifica quantos filmes o usuario ja alugou e nao devolveu
    const activeRentals = await this.rentalsRepository.count({
      where: { userId, isReturned: false },
    });
    if (activeRentals >= 3) {
      throw new BadRequestException(
        'You already mentioned the maximum number of 3 movies.',
      );
    }

    // verifica a disponibilidade do filme
    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
    });
    if (!movie) {
      throw new BadRequestException('Movie not found.');
    }

    // muda o status do filme de false para true
    await this.movieRepository.update(movieId, { isRented: true });

    // verifica se o filme ja esta alugado
    if (movie.isRented) {
      throw new BadRequestException('Movie is already rented.');
    }
    // cria a locacao de um filme
    const rental = this.rentalsRepository.create({
      userId,
      movieId,
      rentalDate: new Date(),
      isReturned: false,
    });

    return await this.rentalsRepository.save(rental);
  }

  async findAll(): Promise<Rental[]> {
    return await this.rentalsRepository.find();
  }

  async findOne(id: number): Promise<Rental> {
    return await this.rentalsRepository.findOne({ where: { id } });
  }
}

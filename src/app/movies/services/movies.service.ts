import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from '../dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async create(dto: CreateMovieDto) {
    const state = ['novo', 'danificado', 'usado'];
    const randomState = state[Math.floor(Math.random() * state.length)];

    const movie = {
      title: dto.title,
      overview: dto.overview,
      vote_average: dto.vote_average,
      poster_path: dto.poster_path,
      release_date: dto.release_date,
      state_conservation: randomState,
    };

    return await this.moviesRepository.save(
      this.moviesRepository.create(movie),
    );
  }
  async findAll() {
    return await this.moviesRepository.find();
  }

  async findOne(id: number) {
    const movie: Movie = await this.moviesRepository.findOne({ where: { id } });

    if (!movie) {
      throw new Error('Movie not found.');
    }

    return movie;
  }

  async update(id: number, updateDto: UpdateMovieDto) {
    const movie = await this.findOne(id);

    if (!movie) {
      throw new NotFoundException();
    }
    Object.assign(movie, updateDto);

    return await this.moviesRepository.save(movie);
  }

  async remove(id: number) {
    try {
      const movie = await this.findOne(id);

      if (!movie) {
        throw new NotFoundException();
      }

      return await this.moviesRepository.remove(movie);
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException(
          'Cannot delete movie. There are rentals associated with this movie.',
        );
      }
      throw error;
    }
  }
}

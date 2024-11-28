import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../entities/movie.entity';
import { MovieApiService } from './movie-api.service';

@Injectable()
export class MoviesSyncService {
  constructor(
    private readonly movieApiService: MovieApiService,
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async syncMovies(): Promise<void> {
    const movies = await this.movieApiService.fetchMovies();

    for (const movie of movies) {
      const existingMovie = await this.moviesRepository.findOne({
        where: { id: movie.id },
      });

      if (existingMovie) {
        // atualiza de acordo com as atualizacoes da API de filmes
        existingMovie.overview = movie.overview;
        existingMovie.vote_average = movie.vote_average;

        await this.moviesRepository.save(existingMovie);
      } else {
        console.log('Nenhum filme novo para sincronizar.');
      }
    }
  }
}

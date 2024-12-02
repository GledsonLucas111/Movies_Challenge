import { Inject, Injectable } from '@nestjs/common';
import { Movie } from '../entities/movie.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

// import { Repository } from 'typeorm';
import { MoviesService } from './movies.service';

@Injectable()
export class PopularMoviesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private movieService: MoviesService,
  ) {}

  async findPopularMovies(): Promise<Movie[]> {
    const cacheKey = 'popular_movies';

    const cachedMovies = await this.cacheManager.get<Movie[]>(cacheKey);
    if (cachedMovies) {
      console.log(cachedMovies);
      console.log('Retornando do cache...');
      return cachedMovies;
    }

    console.log('Buscando do banco...');
    const movies = await this.movieService.findAll();
    await this.cacheManager.set(cacheKey, movies, 3600);
    return movies;
  }

  async invalidateCache(): Promise<void> {
    const cacheKey = 'popular_movies';
    await this.cacheManager.del(cacheKey);
  }
}

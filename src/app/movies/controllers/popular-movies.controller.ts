import { Controller, Get, Post } from '@nestjs/common';
import { PopularMoviesService } from '../services/popular-movies.service';

@Controller('movies')
export class PopularMoviesController {
  constructor(private readonly popularMoviesService: PopularMoviesService) {}

  @Get('popular')
  async findPopularMovies() {
    console.log('aqui');
    return this.popularMoviesService.findPopularMovies();
  }

  @Post('invalidate-cache')
  async invalidateCache() {
    await this.popularMoviesService.invalidateCache();
    return {
      statusCode: 201,
      message: 'Cache invalidado com sucesso!',
    };
  }
}

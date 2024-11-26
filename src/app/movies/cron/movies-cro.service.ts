import { Cron } from '@nestjs/schedule';
import { MoviesSyncService } from './movie-sync.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MoviesCronService {
  constructor(private readonly moviesSyncService: MoviesSyncService) {}

  @Cron('0 0 * * *')
  async handleCron() {
    console.log('Iniciando sincronização de filmes...');
    await this.moviesSyncService.syncMovies();
    console.log('Sincronização de filmes concluída.');
  }
}

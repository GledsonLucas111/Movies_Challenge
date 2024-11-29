import { Cron, CronExpression } from '@nestjs/schedule';
import { MoviesSyncService } from './movie-sync.service';
import { Injectable } from '@nestjs/common';
import { MailService } from './mail.service';

@Injectable()
export class CronService {
  constructor(
    private readonly moviesSyncService: MoviesSyncService,
    private readonly mailService: MailService,
  ) {}

  @Cron('0 0 * * *') // Todo dia as 00:00
  async handleCron() {
    console.log('Iniciando sincronização de filmes...');
    await this.moviesSyncService.syncMovies();
    console.log('Sincronização de filmes concluída.');
  }

  @Cron(CronExpression.EVERY_12_HOURS) // Executa a cada doze horas
  async handleLowStockCheck() {
    console.log('Verificando estoque...');
    await this.mailService.checkLowStock();
  }
}

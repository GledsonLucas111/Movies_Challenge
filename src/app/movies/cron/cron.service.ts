import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { ExternalServices } from './external.service';

@Injectable()
export class CronService {
  constructor(private readonly externalService: ExternalServices) {}

  @Cron('0 0 * * *') // Todo dia as 00:00
  async handleCron() {
    console.log('Iniciando sincronização de filmes...');
    await this.externalService.syncMovies();
    console.log('Sincronização de filmes concluída.');
  }

  @Cron(CronExpression.EVERY_12_HOURS) // Executa a cada doze horas
  async handleLowStockCheck() {
    console.log('Verificando estoque...');
    await this.externalService.checkLowStock();
  }

  @Cron(CronExpression.EVERY_12_HOURS) // Executa a cada doze horas
  async handleLateReturnMovie() {
    console.log('Verificando data de devolucoes...');
    await this.externalService.checkLateReturn();
  }
}

import { Rental } from 'src/app/rentals/entities/rental.entity';
import { User, UserRole } from 'src/app/user/entity/user.entity';
import { Movie } from '../entities/movie.entity';

import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import axios from 'axios';

export class ExternalServices {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  private readonly apiUrl = this.configService.get<string>('API_BASE_URL');
  private readonly apiKey = this.configService.get<string>('API_KEY');

  // Mailer service
  isDateMoreThanDaysAgo(date: Date, days: number) {
    const currentDate = new Date();

    // calcula a diferenca em milissegundos
    const diffInTime = currentDate.getTime() - date.getTime();

    // calcula a diferenca para dias
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    // retorna true se diffInDays for maior que days
    return diffInDays > days;
  }
  async checkLowStock(): Promise<void> {
    try {
      const usersAdmin = await this.userRepository.find({
        where: { role: UserRole.ADMIN },
      });
      // faz um map de todos os eamil dos administradores
      usersAdmin.map(async (user) => {
        if ((await this.moviesRepository.find()).length <= 4) {
          // envia um e-mail para os adms
          await this.mailerService.sendMail({
            to: user.email,
            subject: 'Aviso: Estoque de filmes esta baixo',
            text: 'Adicione mais filmes...',
          });
          console.log('E-mail enviado com sucesso!');
        } else {
          console.log('O estoque de filmes nao esta baixo.');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  async checkLateReturn() {
    const lateReturn = await this.rentalRepository.find();
    const users = await this.userRepository.find({
      where: { role: UserRole.ADMIN },
    });

    lateReturn.map(async (rental) => {
      if (
        this.isDateMoreThanDaysAgo(rental.rentalDate, 20) &&
        rental.isReturned === false
      ) {
        users.map(async (user) => {
          return await this.mailerService.sendMail({
            to: user.email,
            subject: 'Aviso: usuario com atrado na devolucao',
            text: `O(a) usuario(a): ${(await this.userRepository.findOne({ where: { id: rental.userId } })).name} esta com a devolucao atrasada`,
          });
        });
      } else if (
        !this.isDateMoreThanDaysAgo(rental.rentalDate, 20) ||
        rental.isReturned === true
      ) {
        console.log('todos os alugeis estao em dias');
      }
    });
  }

  // API Service
  async fetchMovies(): Promise<any[]> {
    try {
      const response = await axios.get(this.apiUrl, {
        params: { api_key: this.apiKey },
      });
      return response.data.results;
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }

  // Sync Service
  async syncMovies(): Promise<void> {
    const movies = await this.fetchMovies();

    for (const movie of movies) {
      const existingMovie = await this.moviesRepository.findOne({
        where: { id: movie.id },
      });

      if (existingMovie) {
        // atualiza de acordo com as atualizacoes da API de filmes
        existingMovie.overview = movie.overview;
        existingMovie.vote_average = movie.vote_average;

        await this.moviesRepository.save(existingMovie);
        console.log('Filmes sincronizados.');
      } else {
        console.log('Nenhum filme novo para sincronizar.');
      }
    }
  }
}

import { MailerService } from '@nestjs-modules/mailer';
import { Movie } from '../entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../user/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { Rental } from 'src/app/rentals/entities/rental.entity';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
    private readonly mailerService: MailerService,
  ) {}

  async checkLowStock(): Promise<void> {
    try {
      const usersAdmin = await this.userRepository.find({
        where: { role: UserRole.ADMIN },
      });
      // faz um map de todos os eamil dos administradores
      usersAdmin.map(async (user) => {
        if ((await this.movieRepository.find()).length <= 4) {
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
  isDateMoreThanDaysAgo(date: Date, days: number) {
    const currentDate = new Date();

    // calcula a diferenca em milissegundos
    const diffInTime = currentDate.getTime() - date.getTime();

    // calcula a diferenca para dias
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    // retorna true se diffInDays for maior que days
    return diffInDays > days;
  }
}

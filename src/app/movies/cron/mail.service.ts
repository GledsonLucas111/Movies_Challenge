import { MailerService } from '@nestjs-modules/mailer';
import { Movie } from '../entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../user/entity/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}

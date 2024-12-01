import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/app/movies/entities/movie.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { User } from 'src/app/user/entity/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotifyService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async notifyUsersOfReleasedMovies() {
    const now = new Date();
    const releasedMovies = await this.movieRepository.find({
      where: { release_date: LessThanOrEqual(now) },
    });

    for (const movie of releasedMovies) {
      const reservations = await this.reservationRepository.find({
        where: { movieId: movie.id, notified: false },
      });

      for (const reservation of reservations) {
        const user = await this.userRepository.findOne({
          where: { id: reservation.userId },
        });
        if (user && user.email) {
          await this.mailerService.sendMail({
            to: user.email,
            subject: 'Notificação de Lançamento',
            text: `O filme "${movie.title}" está disponível para locação!`,
          });
        }
        reservation.notified = true;
        await this.reservationRepository.save(reservation);
      }
    }
  }
}

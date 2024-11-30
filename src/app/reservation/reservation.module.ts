import { Module } from '@nestjs/common';
import { ReservationService } from './services/reservation.service';
import { ReservationController } from './controller/reservation.controller';
import { MoviesModule } from '../movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { NotifyService } from './cron/notify.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Reservation]),
    MoviesModule,
    UserModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService, NotifyService],
})
export class ReservationModule {}

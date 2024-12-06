import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
// import { Movie } from 'src/app/movies/entities/movie.entity';
// import { Rental } from 'src/app/rentals/entities/rental.entity';
// import { Reservation } from 'src/app/reservation/entities/reservation.entity';
// import { User } from 'src/app/user/entities/user.entity';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: Number(configService.getOrThrow('DB_PORT')),
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_DATABASE'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migration/*.js'],
});

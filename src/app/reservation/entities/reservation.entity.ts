import { Movie } from 'src/app/movies/entities/movie.entity';
import { User } from 'src/app/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rentals)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.rentals)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  movieId: number;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: false })
  notified: boolean;
}

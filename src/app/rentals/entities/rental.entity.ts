import { User } from '../../user/entities/user.entity';
import { Movie } from '../../movies/entities/movie.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rentals')
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rentals)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => Movie, (movie) => movie.rentals)
  @JoinColumn({ name: 'movieId' })
  movie?: Movie;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false, type: 'bigint' })
  movieId: number;

  @Column()
  rentalDate: Date;

  @Column({ nullable: true })
  returnDate: Date;

  @Column({ default: false })
  isReturned: boolean;
}

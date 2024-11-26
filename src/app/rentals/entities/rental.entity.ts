import { User } from 'src/app/user/entity/user.entity';
import { Movie } from 'src/app/movies/entities/movie.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rentals')
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rentals)
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.rentals)
  movie: Movie;

  @Column()
  rentalDate: Date;

  @Column({ nullable: true })
  returnDate: Date;

  @Column({ default: false })
  isReturned: boolean;
}

import { User } from '../../user/entity/user.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('rentals')
export class Rental {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.rentals)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.rentals)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column()
  userId: string; // Chave estrangeira para users.id

  @Column()
  movieId: string;

  @Column()
  rentalDate: Date;

  @Column({ nullable: true })
  returnDate: Date;

  @Column({ default: false })
  isReturned: boolean;
}

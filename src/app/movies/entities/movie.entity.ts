import { Reservation } from 'src/app/reservation/entities/reservation.entity';
import { Rental } from '../../rentals/entities/rental.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  overview: string;

  @Column()
  vote_average: string;

  @Column()
  poster_path: string;

  @Column()
  release_date: Date;

  @Column({ default: false })
  isRented: boolean;

  @Column()
  state_conservation: string;

  @OneToMany(() => Rental, (rental) => rental.movie)
  rentals?: Rental[];

  @OneToMany(() => Reservation, (reservation) => reservation.movie)
  reservation?: Rental[];
}

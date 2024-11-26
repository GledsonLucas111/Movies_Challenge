import { Rental } from 'src/app/rentals/entities/rental.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number | string;

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

  @Column()
  stock: number;

  @Column()
  state_conservation: string;

  @OneToMany(() => Rental, (rental) => rental.movie)
  rentals?: Rental[];
}

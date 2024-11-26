import { Rental } from '../../rentals/entities/rental.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryColumn({ unique: true, type: 'bigint' })
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

  @Column()
  stock: number;

  @Column()
  state_conservation: string;

  @OneToMany(() => Rental, (rental) => rental.movie)
  rentals?: Rental[];
}

import { Rental } from 'src/app/rentals/entities/rental.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  releaseDate: Date;

  @Column()
  stock: number;

  @OneToMany(() => Rental, (rental) => rental.movie)
  rentals?: Rental[];
}

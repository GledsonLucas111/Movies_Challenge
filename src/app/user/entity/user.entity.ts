import { Reservation } from 'src/app/reservation/entities/reservation.entity';
import { Rental } from '../../rentals/entities/rental.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Rental, (rental) => rental.user)
  rentals?: Rental[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation?: Rental[];
}

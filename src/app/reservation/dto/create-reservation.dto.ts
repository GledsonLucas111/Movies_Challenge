import { IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  movieId: number;
}

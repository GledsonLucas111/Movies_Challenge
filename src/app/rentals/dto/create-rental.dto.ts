import { IsNumber } from 'class-validator';

export class CreateRentalDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  movieId: number;
}

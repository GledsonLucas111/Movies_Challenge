import { IsString } from 'class-validator';

export class CreateRentalDto {
  @IsString()
  userId: string;

  @IsString()
  movieId: string;
}

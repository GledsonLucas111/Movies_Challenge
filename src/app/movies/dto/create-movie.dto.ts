import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  title: string;

  @IsString()
  overview: string;

  @IsString()
  vote_average: string;

  @IsString()
  poster_path: string;

  @IsString()
  release_date: Date;
}

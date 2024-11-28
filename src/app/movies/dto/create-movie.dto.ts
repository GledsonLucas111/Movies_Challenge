import { IsString } from 'class-validator';

export class CreateMovieDto {
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

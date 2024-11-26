import { Movie } from '../entities/movie.entity';

export class CreateMovieDto implements Movie {
  id: number | string;
  title: string;
  overview: string;
  vote_average: string;
  poster_path: string;
  release_date: Date;
  stock: number;
  state_conservation: string;
}

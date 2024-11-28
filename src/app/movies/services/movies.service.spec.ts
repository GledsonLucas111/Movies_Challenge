import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from '../entities/movie.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie>;

  const mockMovieRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(movieRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovie = {
        id: 12345,
        title: 'Homem de ferro',
        overview:
          'personagem de quadrinhos da Marvel Comics e um super-herói que usa armaduras de alta tecnologia para combater o crime.',
        vote_average: '1234',
        poster_path: 'path',
        release_date: undefined,
      };
      const savedMovie: Movie = {
        ...createMovie,
        state_conservation: 'novo',
        isRented: false,
      };

      mockMovieRepository.create.mockReturnValue(createMovie);
      mockMovieRepository.save.mockResolvedValue(savedMovie);

      const result = await service.create(createMovie);

      expect(mockMovieRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(createMovie),
      );
      expect(mockMovieRepository.save).toHaveBeenCalledWith(createMovie);
      expect(result).toEqual(savedMovie);
    });
  });
  describe('findAll', () => {
    it('shoud return a movie list with sucess', async () => {
      const movieList: Movie[] = [
        {
          id: 12345,
          title: 'Homem de ferro',
          overview:
            'personagem de quadrinhos da Marvel Comics e um super-herói que usa armaduras de alta tecnologia para combater o crime.',
          vote_average: '1234',
          poster_path: 'path',
          release_date: undefined,
          isRented: false,
          state_conservation: 'novo',
        },
        {
          id: 123456,
          title: 'Homem de ferro 2',
          overview:
            'personagem de quadrinhos da Marvel Comics e um super-herói que usa armaduras de alta tecnologia para combater o crime.',
          vote_average: '1234',
          poster_path: 'path',
          release_date: undefined,
          isRented: false,
          state_conservation: 'usado',
        },
      ];

      mockMovieRepository.find.mockResolvedValue(movieList);

      const result = await service.findAll();

      expect(mockMovieRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(movieList);
    });
  });
  describe('findOne', () => {
    it('should return a movie when a valid ID is provided', async () => {
      const movieId = 12345;
      const movie: Movie = {
        id: movieId,
        title: 'Homem de ferro',
        overview:
          'personagem de quadrinhos da Marvel Comics e um super-herói que usa armaduras de alta tecnologia para combater o crime.',
        vote_average: '1234',
        poster_path: 'path',
        release_date: undefined,
        isRented: false,
        state_conservation: 'novo',
      };

      mockMovieRepository.findOne.mockResolvedValue(movie);

      const result = await service.findOne(movie.id);

      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { id: movie.id },
      });
      expect(result).toEqual(movie);
    });
  });
  describe('Update', () => {
    it('should update and return the updated movie when a valid ID is provided', async () => {
      const movieId = 12345;
      const updateMovie = { title: 'batman' };
      const movie: Movie = {
        id: movieId,
        title: 'Homem de ferro',
        overview:
          'personagem de quadrinhos da Marvel Comics e um super-herói que usa armaduras de alta tecnologia para combater o crime.',
        vote_average: '1234',
        poster_path: 'path',
        release_date: undefined,
        isRented: false,
        state_conservation: 'novo',
      };
      // busca pelo usuario
      mockMovieRepository.findOne.mockResolvedValue(movie);

      // salvemtno do usuario atualizado
      const updateUser = { ...movie, ...updateMovie };
      mockMovieRepository.save.mockResolvedValue(updateUser);

      const result = await service.update(movie.id, updateMovie);

      // verifica se o repositoria foi chamdado corretamente
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { id: movie.id },
      });
      expect(mockMovieRepository.save).toHaveBeenCalledWith(updateUser);

      // veridica se o resultado do metodo esta correto
      expect(result).toEqual(updateUser);
    });
  });
  describe('Delete', () => {
    it('should remove the movie when a valid ID is provided', async () => {
      const movieId = 12345;
      const movie: Movie = {
        id: movieId,
        title: 'Homem de ferro',
        overview:
          'personagem de quadrinhos da Marvel Comics e um super-herói que usa armaduras de alta tecnologia para combater o crime.',
        vote_average: '1234',
        poster_path: 'path',
        release_date: undefined,
        isRented: false,
        state_conservation: 'novo',
      };
      // busca pelo usuario
      mockMovieRepository.findOne.mockResolvedValue(movie);

      // simula a exclusao bem sucedida
      mockMovieRepository.remove.mockResolvedValue(undefined);

      await service.remove(movie.id);

      // verifica se o repositoria foi chamdado corretamente
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { id: movie.id },
      });
      expect(mockMovieRepository.remove).toHaveBeenCalledWith(movie);
    });
  });
});

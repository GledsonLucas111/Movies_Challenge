import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../entities/movie.entity';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMovieRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        MoviesService,
        {
          provide: MoviesService,
          useValue: mockMovieRepository, // Adicionando o mock
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should call MOvieService.create and return the result', async () => {
      const createMovie: Movie = {
        id: 12345,
        title: 'Homem de ferro',
        overview:
          'personagem de quadrinhos da Marvel Comics e um super-herói que usa armaduras de alta tecnologia para combater o crime.',
        vote_average: '1234',
        poster_path: 'path',
        release_date: undefined,
        stock: 2,
        state_conservation: 'novo',
      };
      const savedMovie: Movie = { ...createMovie };

      mockMovieRepository.create.mockResolvedValue(savedMovie);
      const result = await controller.create(createMovie);

      expect(mockMovieRepository.create).toHaveBeenCalledWith(createMovie);
      expect(result).toEqual(savedMovie);
    });
  });
  describe('FindAll', () => {
    it('findAll should return a movie list with success', async () => {
      const movieList: Movie[] = [
        {
          id: 12345,
          title: 'Homem de ferro',
          overview:
            'personagem de quadrinhos da Marvel Comics e um super-herói que usa armaduras de alta tecnologia para combater o crime.',
          vote_average: '1234',
          poster_path: 'path',
          release_date: undefined,
          stock: 2,
          state_conservation: 'novo',
        },
        {
          id: 12345,
          title: 'Homem de ferro',
          overview:
            'personagem de quadrinhos da Marvel Comics e um super-herói que usa armaduras de alta tecnologia para combater o crime.',
          vote_average: '1234',
          poster_path: 'path',
          release_date: undefined,
          stock: 2,
          state_conservation: 'novo',
        },
      ];
      jest.spyOn(mockMovieRepository, 'findAll').mockResolvedValue(movieList);

      const result = await controller.findAll();

      expect(mockMovieRepository.findAll).toHaveBeenCalledTimes(1);

      expect(result).toEqual(movieList);
    });
  });
  describe('FindOne', () => {
    it('should return a movie list with success', async () => {
      const movieId = 12345;
      const movie: Movie = {
        id: movieId,
        title: 'Homem de ferro',
        overview:
          'personagem de quadrinhos da Marvel Comics e um super-herói que usa armaduras de alta tecnologia para combater o crime.',
        vote_average: '1234',
        poster_path: 'path',
        release_date: undefined,
        stock: 2,
        state_conservation: 'novo',
      };

      mockMovieRepository.findOne.mockResolvedValue(movie);

      const result = await controller.findOne(movieId);

      expect(mockMovieRepository.findOne).toHaveBeenCalledWith(movieId);

      expect(result).toEqual(movie);
    });
  });
  describe('Update', () => {
    it('should update and return the updated user when a valid ID is provided', async () => {
      const movieId = 12345;
      const updateMovieDto = { title: 'Batman' };
      const updatedMovie: Movie = {
        id: movieId,
        title: 'Homem de ferro',
        overview:
          'personagem de quadrinhos da Marvel Comics e um super-herói que usa armaduras de alta tecnologia para combater o crime.',
        vote_average: '1234',
        poster_path: 'path',
        release_date: undefined,
        stock: 2,
        state_conservation: 'novo',
      };

      mockMovieRepository.update.mockResolvedValue(updatedMovie);

      const result = await controller.update(movieId, updateMovieDto);

      expect(mockMovieRepository.update).toHaveBeenLastCalledWith(
        movieId,
        updateMovieDto,
      );

      expect(result).toEqual(updatedMovie);
    });
  });
  describe('Delete', () => {
    it('should remove a movie when a valid ID is provided', async () => {
      const movieId = 12345;

      mockMovieRepository.remove.mockResolvedValue(undefined);

      const result = await controller.remove(movieId);

      expect(mockMovieRepository.remove).toHaveBeenCalledWith(movieId);

      expect(result).toBeUndefined();
    });
  });
});

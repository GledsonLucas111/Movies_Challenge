import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { Rental } from '../entities/rental.entity';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from 'src/app/movies/entities/movie.entity';

describe('RentalsService', () => {
  let service: RentalsService;
  let rentalsRepository: Repository<Rental>;

  const mockRentalRepository = {
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };
  const mockMovieRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };
  const mockeDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn().mockImplementation((entity, options) => {
          if (entity === Movie) {
            return Promise.resolve({
              id: options?.where?.id,
              title: 'Future Movie',
              release_date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Data futura
            });
          }
          return null;
        }),
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        RentalsService,
        {
          provide: getRepositoryToken(Rental),
          useValue: mockRentalRepository,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
        {
          provide: DataSource,
          useValue: mockeDataSource,
        },
      ],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
    rentalsRepository = module.get<Repository<Rental>>(
      getRepositoryToken(Rental),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(rentalsRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new rent movie', async () => {
      const createRentDto = {
        userId: 1234,
        movieId: 5678,
      };

      const movie = {
        id: createRentDto.movieId,
        title: 'A Great Movie',
        release_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      };

      const savedRental = {
        id: 1,
        ...createRentDto,
        rentalDate: new Date(),
        returnDate: null,
      };

      mockMovieRepository.findOne.mockResolvedValue(movie);

      mockRentalRepository.count.mockResolvedValue(0);
      mockMovieRepository.update.mockResolvedValue(undefined);
      mockRentalRepository.create.mockReturnValue(savedRental);

      mockRentalRepository.save.mockResolvedValue(savedRental);

      const result = await service.create(createRentDto);

      expect(mockRentalRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(createRentDto),
      );

      expect(mockRentalRepository.save).toHaveBeenCalledWith(savedRental);

      expect(result).toEqual(savedRental);
    });
  });
  describe('findAll', () => {
    it('shoud return a rent movie list with sucess', async () => {
      const rentalList: Rental[] = [
        {
          id: 123456,
          rentalDate: new Date(),
          isReturned: false,
          returnDate: null,
          userId: 54321,
          movieId: 12345,
        },
        {
          id: 123456,
          rentalDate: new Date(),
          isReturned: false,
          returnDate: null,
          userId: 54321,
          movieId: 12345,
        },
      ];
      mockRentalRepository.find.mockResolvedValue(rentalList);
      mockRentalRepository.find.mockResolvedValue(rentalList);

      const result = await service.findAll();

      expect(mockRentalRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(rentalList);
    });
  });
  describe('Update', () => {
    it('should update and return the updated rent when a valid ID is provided', async () => {
      const rentalId = 12345;
      const updateRentalDto = { isReturned: true };
      const rental: Rental = {
        id: rentalId,
        rentalDate: new Date(),
        isReturned: false,
        returnDate: new Date(),
        userId: 54321,
        movieId: 12345,
      };
      // busca pelo usuario
      mockRentalRepository.findOne.mockResolvedValue(rental);

      // salvemtno do usuario atualizado
      const updateUser = { ...rental, ...updateRentalDto };
      mockRentalRepository.save.mockResolvedValue(updateUser);

      const result = await service.update(rental.id);

      // verifica se o repositoria foi chamdado corretamente
      expect(mockRentalRepository.findOne).toHaveBeenCalledWith({
        where: { id: rental.id },
      });
      expect(mockRentalRepository.save).toHaveBeenCalledWith(updateUser);

      // veridica se o resultado do metodo esta correto
      expect(result).toEqual(updateUser);
    });
  });
});

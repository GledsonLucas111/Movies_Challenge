import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { Reservation } from '../entities/reservation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { Movie } from 'src/app/movies/entities/movie.entity';

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: Repository<Reservation>;

  const mockReservationRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const mockMovieRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    reservationRepository = module.get<Repository<Reservation>>(
      getRepositoryToken(Reservation),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(reservationRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new reservation', async () => {
      const createReservationDto: CreateReservationDto = {
        userId: 1234,
        movieId: 12345,
      };

      const movie = {
        id: createReservationDto.movieId,
        title: 'Future Movie',
        release_date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Data no futuro
      };

      const reservationInstance: Reservation = {
        id: undefined,
        userId: createReservationDto.userId,
        movieId: createReservationDto.movieId,
        notified: false,
        createdAt: new Date(),
      };

      const savedReservation: Reservation = {
        ...reservationInstance,
        id: 123456,
      };

      mockMovieRepository.findOne.mockResolvedValue(movie);

      mockReservationRepository.findOne.mockResolvedValue(null);

      mockReservationRepository.create.mockReturnValue(reservationInstance);

      mockReservationRepository.save.mockResolvedValue(savedReservation);

      const result = await service.create(createReservationDto);

      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { id: createReservationDto.movieId },
      });

      expect(mockReservationRepository.findOne).toHaveBeenCalledWith({
        where: {
          userId: createReservationDto.userId,
          movieId: createReservationDto.movieId,
        },
      });

      expect(mockReservationRepository.create).toHaveBeenCalledWith({
        userId: createReservationDto.userId,
        movieId: createReservationDto.movieId,
      });

      expect(mockReservationRepository.save).toHaveBeenCalledWith(
        reservationInstance,
      );

      expect(result).toEqual(savedReservation);

      expect(result).toEqual(savedReservation);
    });
  });

  describe('findAll', () => {
    it('shoud return a reservation list with sucess', async () => {
      const reservationList: Reservation[] = [
        {
          id: 12345,
          createdAt: new Date(),
          movieId: 1234,
          userId: 12345,
          notified: false,
        },
        {
          id: 123456,
          createdAt: new Date(),
          movieId: 123466,
          userId: 1234533,
          notified: false,
        },
      ];

      mockReservationRepository.find.mockResolvedValue(reservationList);

      const result = await service.findAll();

      expect(mockReservationRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(reservationList);
    });
  });
});

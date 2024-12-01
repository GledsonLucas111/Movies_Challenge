import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from '../services/reservation.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { Reservation } from '../entities/reservation.entity';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const mockReservationRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationRepository,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call ReservationService.createReservation and return the result', async () => {
      const createReservationDto: CreateReservationDto = {
        userId: 1234,
        movieId: 12345,
      };
      const savedReservation: Reservation = {
        ...createReservationDto,
        id: 123456,
        notified: false,
        createdAt: new Date(),
      };
      mockReservationRepository.create.mockReturnValue(createReservationDto);

      mockReservationRepository.create.mockResolvedValue(savedReservation);

      const result = await controller.create(createReservationDto);

      expect(mockReservationRepository.create).toHaveBeenCalledWith(
        createReservationDto,
      );
      expect(result).toEqual(savedReservation);
    });
  });
  describe('FindAll', () => {
    it('findAll should return a reservation list with success', async () => {
      const reservationList: Reservation[] = [
        {
          id: 12345,
          createdAt: new Date(),
          movieId: 1234,
          userId: 12345,
          notified: false,
        },
        {
          id: 12345,
          createdAt: new Date(),
          movieId: 1234,
          userId: 12345,
          notified: false,
        },
      ];
      jest
        .spyOn(mockReservationRepository, 'findAll')
        .mockResolvedValue(reservationList);

      const result = await controller.findAll();

      expect(mockReservationRepository.findAll).toHaveBeenCalledTimes(1);

      expect(result).toEqual(reservationList);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { RentalsController } from './rentals.controller';
import { RentalsService } from '../services/rentals.service';
import { Rental } from '../entities/rental.entity';
import { CreateRentalDto } from '../dto/create-rental.dto';

describe('RentalsController', () => {
  let controller: RentalsController;
  let service: RentalsService;

  const mockRentalRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [
        {
          provide: RentalsService,
          useValue: mockRentalRepository,
        },
      ],
    }).compile();

    controller = module.get<RentalsController>(RentalsController);
    service = module.get<RentalsService>(RentalsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call UserService.create and return the result', async () => {
      const createRentalDto: CreateRentalDto = {
        userId: 54321,
        movieId: 12345,
      };
      const savedRental: Rental = {
        ...createRentalDto,
        id: 123456,
        rentalDate: new Date(),
        isReturned: false,
        returnDate: new Date(),
      };

      mockRentalRepository.create.mockResolvedValue(savedRental);
      const result = await controller.create(createRentalDto);

      expect(mockRentalRepository.create).toHaveBeenCalledWith(createRentalDto);
      expect(result).toEqual(savedRental);
    });
  });
  describe('FindAll', () => {
    it('findAll should return a user list with success', async () => {
      const rentalList: Rental[] = [
        {
          id: 123456,
          rentalDate: new Date(),
          isReturned: false,
          returnDate: new Date(),
          userId: 54321,
          movieId: 12345,
        },
        {
          id: 123456,
          rentalDate: new Date(),
          isReturned: false,
          returnDate: new Date(),
          userId: 54321,
          movieId: 12345,
        },
      ];
      jest.spyOn(mockRentalRepository, 'findAll').mockResolvedValue(rentalList);

      const result = await controller.findAll();

      expect(mockRentalRepository.findAll).toHaveBeenCalledTimes(1);

      expect(result).toEqual(rentalList);
    });
  });
  describe('Update', () => {
    it('should update and return the updated user when a valid ID is provided', async () => {
      const rentalId = 12345;
      const updatedRental: Rental = {
        id: rentalId,
        rentalDate: new Date(),
        isReturned: true,
        returnDate: new Date(),
        userId: 54321,
        movieId: 12345,
      };

      mockRentalRepository.update.mockResolvedValue(updatedRental);
      mockRentalRepository.findOne.mockResolvedValue(updatedRental);

      const result = await controller.update(rentalId);

      expect(mockRentalRepository.update).toHaveBeenLastCalledWith(rentalId);

      expect(result).toEqual(updatedRental);
    });
  });
});

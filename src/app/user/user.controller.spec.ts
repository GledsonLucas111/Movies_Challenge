import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call UserService.create and return the result', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Gledson',
        email: 'Gledson@example.com',
        password: '12345',
      };
      const savedUser: User = { id: '123456', ...createUserDto };

      mockUserService.create.mockResolvedValue(savedUser);
      const result = await controller.create(createUserDto);

      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(savedUser);
    });
  });
  describe('FindAll', () => {
    it('findAll should return a user list with success', async () => {
      const userList: User[] = [
        {
          id: '12345',
          name: 'Gledson',
          email: 'gledson@example.com',
          password: '123456',
        },
        {
          id: '1234',
          name: 'Maria',
          email: 'maria@example.com',
          password: '123456',
        },
      ];
      jest.spyOn(mockUserService, 'findAll').mockResolvedValue(userList);

      const result = await controller.findAll();

      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);

      expect(result).toEqual(userList);
    });
  });
  describe('FindOne', () => {
    it('should return a user list with success', async () => {
      const userId = '12345';
      const user: User = {
        id: userId,
        name: 'Gledson',
        email: 'gledson@example.com',
        password: '123456',
      };

      mockUserService.findOne.mockResolvedValue(user);

      const result = await controller.findOne(userId);

      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);

      expect(result).toEqual(user);
    });
    it('should throw an error when the user is not found', async () => {
      const userId = '12345';

      mockUserService.findOne.mockRejectedValue(new Error('User not found.'));

      await expect(controller.findOne(userId)).rejects.toThrowError(
        'User not found.',
      );

      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
    });
  });
  describe('Update', () => {
    it('should update and return the updated user when a valid ID is provided', async () => {
      const userId = '12345';
      const updateUserDto = { email: 'newemail@gmail.com' };
      const updatedUser: User = {
        id: userId,
        name: 'Gledson',
        email: 'gledson@example.com',
        password: '123456',
      };

      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(userId, updateUserDto);

      expect(mockUserService.update).toHaveBeenLastCalledWith(
        userId,
        updateUserDto,
      );

      expect(result).toEqual(updatedUser);
    });
  });
  describe('Delete', () => {
    it('should remove a user when a valid ID is provided', async () => {
      const userId = '12345';

      mockUserService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(userId);

      expect(mockUserService.remove).toHaveBeenCalledWith(userId);

      expect(result).toBeUndefined();
    });
  });
});

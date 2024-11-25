import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Gledson',
        email: 'Gledson1@example.com',
        password: '123Gl@',
      };
      const savedUser: User = {
        ...createUserDto,
        id: '123456',
      };

      mockUserRepository.create.mockReturnValue(createUserDto);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await userService.create(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(createUserDto),
      );
      expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(savedUser);
    });
  });
  describe('findAll', () => {
    it('shoud return a user list with sucess', async () => {
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

      mockUserRepository.find.mockResolvedValue(userList);

      const result = await userService.findAll();

      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userList);
    });
  });
  describe('findOne', () => {
    it('should return a user when a valid ID is provided', async () => {
      const userId = '12345';
      const user: User = {
        id: userId,
        name: 'Gledson',
        email: 'gledson@example.com',
        password: '123456',
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.findOne(user.id);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(result).toEqual(user);
    });
    it('should throw an error when the user is not found', async () => {
      const userId = '12345';

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.findOne(userId)).rejects.toThrowError(
        'User not found.',
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});

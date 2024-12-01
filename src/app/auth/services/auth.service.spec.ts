import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from 'src/app/user/entity/user.entity';
import { UserPayload } from '../model/UserPayload';
import { UserService } from 'src/app/user/services/user.service';

describe('AuthService', () => {
  let service: AuthService;

  // Corrigindo o nome do mock de JetService para JwtService
  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService, // Injetando o mockJwtService no JwtService
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Login', () => {
    it('should return an access token for valid user credentials', async () => {
      const email = 'test@example.com';
      const password = '1234567GL';
      const user: User = {
        id: 12345,
        email,
        password,
        name: 'Gledson',
        role: UserRole.USER,
      };
      const token = 'mocked-jwt-token';

      jest.spyOn(service, 'validateUser').mockResolvedValue(user);

      mockJwtService.sign.mockReturnValue(token);

      const result = await service.Login(email, password);

      const expectedPayload: UserPayload = { username: email, sub: user.id };

      expect(service.validateUser).toHaveBeenCalledWith(email, password);
      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({ accessToken: token });
    });

    it('should throw an error if validateUser fails', async () => {
      const email = 'invalid@example.com';
      const password = 'wrongpassword';

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.Login(email, password)).rejects.toThrowError(
        'Invalid credentials',
      );
    });
  });
});

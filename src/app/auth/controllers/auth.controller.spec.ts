import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    Login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Login', () => {
    it('hould call AuthService.Login and return an access token', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = { accessToken: 'mocked-jwt-token' };

      mockAuthService.Login.mockResolvedValue(mockToken);

      const result = await controller.Login(loginDto);

      expect(service.Login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(result).toEqual(mockToken);
    });

    it('should throw an error if AuthService.Login fails', async () => {
      const loginDto = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.Login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.Login(loginDto)).rejects.toThrowError(
        'Invalid credentials',
      );
    });
  });
});

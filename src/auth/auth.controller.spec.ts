import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from './schemas/user.schema';

const token = 'jwtToken';

const mockUser = {
  _id: "633e5d14c87cdba7a2ed3ef6",
  name:"donato",
  email:"donato@email.com",
  role: UserRole.USER,
  password: "hasedPassowrd"
};

const mockAuthService = {
  signUp: jest.fn().mockResolvedValueOnce({token}),
  login: jest.fn().mockResolvedValueOnce({token}),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user return token', async () => {
      const userDto = {...mockUser};

      const result = await controller.signUp(userDto);

      expect(service.signUp).toHaveBeenCalled();
      expect(result).toEqual({token});
  });

  it('should login a user return token', async () => {
    const userDto = {...mockUser};

    const result = await controller.login(userDto);

    expect(service.login).toHaveBeenCalled();
    expect(result).toEqual({token});
  });
});

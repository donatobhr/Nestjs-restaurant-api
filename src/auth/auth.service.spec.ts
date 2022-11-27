import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User, UserRole } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import APIFeautures from '../utils/apiFeature.utils';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { UnauthorizedException } from '@nestjs/common';

const mockUserModel = {
  create: jest.fn(),
  findOne: jest.fn()
};

const mockUser = {
  _id: "633e5d14c87cdba7a2ed3ef6",
  name:"donato",
  email:"donato@email.com",
  role: UserRole.USER,
  password: "hasedPassowrd"
};

const token = 'jwtToken';

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZX',
          signOptions: { expiresIn: '1d' }
        })
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  it('should register a new user', async () => {
    const {name, email, password} = {...mockUser};
    jest
      .spyOn(bcrypt, 'hash')
      .mockResolvedValueOnce('testHash');
    jest
      .spyOn(APIFeautures, 'assignJwtToken')
      .mockResolvedValueOnce(token);
    mockUserModel.create.mockImplementationOnce(() => Promise.resolve(mockUser));

    const result = await service.signUp({name, email, password});
    
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(result.token).toEqual(token);
  });

  it('should throw duplicate email error', async () => {
    const {name, email, password} = {...mockUser};
    mockUserModel.create.mockImplementationOnce(() => Promise.reject({code: 11000 }));

    await expect(service.signUp({name, email, password})).rejects.toThrow(ConflictException);
  });


  it('should login user and return the token', async () => {
    const loginDto = {...mockUser};
    mockUserModel.findOne
      .mockImplementationOnce(() => ({
        select: jest.fn().mockResolvedValueOnce(mockUser)
      }));

    jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValueOnce(true);
    
    jest
      .spyOn(APIFeautures, 'assignJwtToken')
      .mockResolvedValueOnce(token);

    const result = await service.login(loginDto as any);

    expect(result.token).toEqual(token);
  });

  it('should throw invalid email error', async () => {
    const loginDto = {...mockUser};
    mockUserModel.findOne.mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(null)
    }));

    await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw invalid password error', async () => {
    const loginDto = {...mockUser};
    mockUserModel.findOne.mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(null)
    }));

    jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValueOnce(false);

    await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
  });
});

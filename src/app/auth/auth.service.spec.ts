import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createResponseWithObject, Response } from 'src/shared/utils/response';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { AuthService } from './auth.service';

const authBodyMock = {
  email: 'teste22@gmail.com',
  password: 'aA#123456',
};
const refreshBodyMock = {
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsIns5cCI6IkpXVCJ9.eyJpYXQiOjE2ODA4MDAxNzEsImV4cCI6MTcyNjQzMzUwNCwic3ViIjoiMzIzZTc3OWItNmU1Zi00MWJjLTgxMTItNThmMTE1YzNjMmEzIn0.5m6clpEbucIUgy1_pdWnjSL53JTdiae5epSGB8-7uEc',
};
const userMock = {
  id: '323e779b-6e5f-41bc-8112-58f115c3c2a3',
  company_id: '0c49aae8-698a-4a5d-b3f8-8bcf9641bf08',
  email: 'teste22@gmail.com',
  name: 'teste',
  password: '$2b$10$auxNLN/kyeea20FvXTEeiu27DJXCrxZ8nUokIMfsk5ojTIm05TN5G',
  createdAt: '2023-04-06T19:56:02.449Z',
  updatedAt: '2023-04-06T19:56:02.449Z',
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
      imports: [ConfigModule],
    }).compile();

    service = module.get(AuthService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('login', () => {
    it('should return a authenticated user successfully', async () => {
      //mock

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(userMock as UserEntity);

      // Act

      const result = await service.login(authBodyMock);

      // Assert
      const validToken = await service.validateToken({
        token: result.accessToken,
        type: 'access',
      });

      expect(validToken).toHaveProperty('isValid');
      expect(validToken).toMatchObject({ isValid: true });
    });

    it('should throw an exception on invalid password', () => {
      // Mocks
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(userMock as UserEntity);

      // Assert
      expect(
        service.login({ email: 'teste@gmail.com', password: '123' }),
      ).rejects.toThrowError();
    });
    it('should throw a not exist user exception', () => {
      // Mocks
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      // Assert
      expect(
        service.login({ email: 'teste@gmail.com', password: '123' }),
      ).rejects.toThrowError();
    });
  });
  describe('refresh', () => {
    it('should return a refresh token authenticated user successfully', async () => {
      //mock

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(userMock as UserEntity);
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(userMock as UserEntity);

      // Act
      const newToken = await service.login(authBodyMock);

      const result = await service.refresh({
        refreshToken: newToken.refreshToken,
      });

      // Assert
      const validToken = await service.validateToken({
        token: result.accessToken,
        type: 'refresh',
      });

      expect(validToken).toHaveProperty('isValid');
      expect(validToken).toMatchObject({ isValid: true });
    });

    it('should throw a invalid token exception', () => {
      // Mocks
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      // Assert
      expect(service.refresh(refreshBodyMock)).rejects.toThrowError();
    });
  });
});

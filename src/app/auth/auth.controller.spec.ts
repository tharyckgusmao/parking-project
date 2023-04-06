import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthController } from './auth.controller';
import { AuthService, ILoginReturn } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

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
const authenticatedMock = {
  user: userMock,
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODA4MDAxNzEsImV4cCI6MTcyNjQzMzUwNCwic3ViIjoiMzIzZTc3OWItNmU1Zi00MWJjLTgxMTItNThmMTE1YzNjMmEzIn0.5m6clpEbucIUgy1_pdWnjSL53JTdiae5epSGB8-7uEc',
  accessTokenExpiresIn: 45633333,
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODA4MDAxNzEsImV4cCI6MTcyNjQzMzUwNCwic3ViIjoiMzIzZTc3OWItNmU1Zi00MWJjLTgxMTItNThmMTE1YzNjMmEzIn0.5m6clpEbucIUgy1_pdWnjSL53JTdiae5epSGB8-7uEc',
  refreshTokenExpiresIn: 45633333,
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
          useValue: {
            login: jest.fn(),
            refresh: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
  describe('login', () => {
    it('should return a new vehicle on controller successfully', async () => {
      const payloadBody = authBodyMock;
      const payloadResponse = authenticatedMock as ILoginReturn;
      const payloadBodyDto = plainToInstance(LoginDto, payloadBody);
      const errors = await validate(payloadBodyDto);
      jest.spyOn(service, 'login').mockResolvedValue(payloadResponse);

      // Act
      const result = await controller.login(payloadBodyDto);
      console.log(result);
      // Assert
      expect(errors.length).toEqual(0);
      expect(result).toEqual(payloadResponse);
      expect(service.login).toHaveBeenCalledTimes(1);
    });
    it('should on invalid data body Exception', async () => {
      const payloadBody = {
        email: '123',
      };

      const payloadBodyDto = plainToInstance(LoginDto, payloadBody);
      const errors = await validate(payloadBodyDto);
      // Assert
      expect(errors.length).not.toBe(0);
      expect(service.login).toHaveBeenCalledTimes(0);
    });
  });
  describe('refresh', () => {
    it('should on invalid data body Exception', async () => {
      const payloadBodyDto = plainToInstance(RefreshDto, { refresh: 123 });
      const errors = await validate(payloadBodyDto);
      // Assert
      expect(errors.length).not.toBe(0);
      expect(service.refresh).toHaveBeenCalledTimes(0);
    });
  });
});

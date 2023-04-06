import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createResponseWithObject, Response } from 'src/shared/utils/response';
import { DeleteResult, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

const userCreateMock = {
  company_id: '123',
  email: 'teste@gmail.com',
  name: 'teste',
  password: '123456',
};
const usersMock = [
  {
    company: {
      id: '651084df-b024-4d76-8968-638dbe8c3954',
      name: 'tharyck',
      cnpj: '10000000000000',
      address: 'Rua henrique gorceix 1770',
      phone: '31982695343',
      qtyVacancyCars: 20,
      qtyVacancyMotors: 40,
      createdAt: '2023-04-05T20:29:15.473Z',
      updatedAt: '2023-04-05T20:29:15.473Z',
    },
    email: 'teste@gmail.com',
    name: 'teste',
    password: '123456',
    id: '3fc58713-0b88-41b7-8c1c-3bc4f8909c84',
    createdAt: '2023-04-06T05:08:20.793Z',
    updatedAt: '2023-04-06T05:08:20.793Z',
  },
  {
    company: {
      id: '651084df-b024-4d76-828-638dbe8c3954',
      name: 'tharyck2',
      cnpj: '10000000000000',
      address: 'Rua henrique gorceix 1770',
      phone: '31982695343',
      qtyVacancyCars: 20,
      qtyVacancyMotors: 40,
      createdAt: '2023-04-05T20:29:15.473Z',
      updatedAt: '2023-04-05T20:29:15.473Z',
    },
    email: 'teste@gmail.com',
    name: 'teste',
    password: '123456',
    id: '3fc58713-0b28-41b7-8c1c-3bc4f8909c84',
    createdAt: '2023-04-06T05:08:20.793Z',
    updatedAt: '2023-04-06T05:08:20.793Z',
  },
];

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(),
            count: jest.fn(),
            save: jest.fn(),
            findOneOrFail: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });
  describe('findAll', () => {
    it('should return a users list entity successfully', async () => {
      //mock
      const userMock = usersMock as UserEntity[];
      const params = {
        current: 0,
        perPage: 10,
      };
      const total = 2;
      const payloadResponse: Response = createResponseWithObject({
        current: params.current,
        perPage: params.perPage,
        total: total,
        items: { users: userMock },
      });

      jest.spyOn(userRepository, 'find').mockResolvedValue(userMock);
      jest.spyOn(userRepository, 'count').mockResolvedValue(2);

      // Act
      const result = await service.findAll(params);
      // Assert

      expect(result).toEqual(payloadResponse);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
      expect(userRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should thow an exception', () => {
      //Mocks
      jest.spyOn(userRepository, 'find').mockRejectedValueOnce(new Error());

      //Assert
      expect(service.findAll).rejects.toThrowError();
    });
  });

  describe('findOneOrFail', () => {
    it('should return a user entity item succesfully!', async () => {
      // mocks
      const usersMockItem = usersMock[0] as UserEntity;
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValue(usersMockItem);

      //Act

      const result = await service.findOneOrFail(
        '651084df-b024-4d76-8968-638dbe8c3954',
      );

      //Assert
      expect(result).toEqual(usersMockItem);
      expect(userRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('Should throw a not found exception', () => {
      //Act
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.findOneOrFail('651084df-b024-4d76-8968-638dbe8c3954'),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('create', () => {
    it('Should create a new user item success!', async () => {
      //Mock
      const data: CreateDto = userCreateMock;
      const usersMockItem = usersMock[0] as UserEntity;

      jest.spyOn(userRepository, 'save').mockResolvedValue(usersMockItem);

      jest.spyOn(userRepository, 'create').mockReturnValue(usersMockItem);

      //Act
      const result = await service.create(data);

      //Assert
      expect(result).toEqual(usersMockItem);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Should throw an exception', async () => {
      //Mock
      const data: CreateDto = userCreateMock;
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      //Assert
      expect(service.create(data)).rejects.toThrowError();
    });
  });
  describe('update', () => {
    it('Should update a user entity item success!', async () => {
      //Mock
      const data: UpdateDto = userCreateMock;
      const usersMockItem = usersMock[0] as UserEntity;

      jest.spyOn(userRepository, 'save').mockResolvedValue(usersMockItem);
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValue(usersMockItem);

      jest.spyOn(userRepository, 'merge').mockReturnValue(usersMockItem);

      //Act
      const result = await service.update(usersMockItem.id, data);

      //Assert
      expect(result).toEqual(usersMockItem);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });
    it('Should update a user entity item diferent email alredy associate Exception!', async () => {
      //Mock
      const data: UpdateDto = userCreateMock;
      const usersMockItem = usersMock[0] as UserEntity;
      const diferentEmail = {
        ...usersMockItem,
        id: '123456',
      } as UserEntity;
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValue(usersMockItem);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(diferentEmail);

      //Assert
      expect(service.update(usersMockItem.id, data)).rejects.toThrowError(
        BadRequestException,
      );
    });
    it('Should throw a not found exception', () => {
      //Act
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.findOneOrFail('651084df-b024-4d76-8968-638dbe8c3954'),
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should throw an exception', async () => {
      //Mock
      const data: UpdateDto = userCreateMock;
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.update('651084df-b024-4d76-8968-638dbe8c3954', data),
      ).rejects.toThrowError();
    });
  });
  describe('delete', () => {
    it('Should delete by id user entity success!', async () => {
      //Mock
      const usersMockItem = usersMock[0] as UserEntity;

      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValue(usersMockItem);
      jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValue({} as DeleteResult);

      //Act
      const result = await service.deleteById(
        '651084df-b024-4d76-8968-638dbe8c3954',
      );
      //Assert
      expect(result).toEqual({});
      expect(userRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('Should throw a not found exception', () => {
      //Act
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.deleteById('651084df-b024-4d76-8968-638dbe8c3954'),
      ).rejects.toThrowError(NotFoundException);
    });
    it('Should throw an exception', async () => {
      //Mock
      jest.spyOn(userRepository, 'delete').mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.deleteById('651084df-b024-4d76-8968-638dbe8c3954'),
      ).rejects.toThrowError();
    });
  });
});

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createResponseWithObject, Response } from 'src/shared/utils/response';
import { DeleteResult, Repository } from 'typeorm';
import { VehicleService } from './vehicle.service';
import { CreateDto } from './dto/create.dto';
import { VehicleEntity } from './entity/vehicle.entity';

const companyId = '651084df-b024-4d76-8968-638dbe8c3954';
const vehicleCreateMock = {
  company_id: '123',
  brand: 'ford',
  model: 'v2',
  color: 'vermelho',
  plate: '123egfr',
  type: 'car',
};
const vehiclesMock = [
  {
    brand: 'ford',
    model: 'v2',
    color: 'vermelho',
    plate: '123egfr',
    type: 'car',
    id: '3fc58713-0b88-41b7-8c1c-3bc4f8909c84',
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
    createdAt: '2023-04-06T05:08:20.793Z',
    updatedAt: '2023-04-06T05:08:20.793Z',
  },
  {
    brand: 'ford',
    model: 'v2',
    color: 'vermelho',
    plate: '123egfr',
    type: 'car',
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
    id: '3fc58723-0b88-41b7-8c1c-3bc4f8909c84',
    createdAt: '2023-04-06T05:08:20.793Z',
    updatedAt: '2023-04-06T05:08:20.793Z',
  },
];

describe('VehicleService', () => {
  let service: VehicleService;
  let vehicleRepository: Repository<VehicleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            find: jest.fn(),
            count: jest.fn(),
            save: jest.fn(),
            findOneOrFail: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(VehicleService);
    vehicleRepository = module.get(getRepositoryToken(VehicleEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(vehicleRepository).toBeDefined();
  });
  describe('findAll', () => {
    it('should return a vehicles list entity successfully', async () => {
      //mock
      const vechicleMock = vehiclesMock as VehicleEntity[];
      const params = {
        current: 0,
        perPage: 10,
      };
      const total = 2;
      const payloadResponse: Response = createResponseWithObject({
        current: params.current,
        perPage: params.perPage,
        total: total,
        items: { vehicles: vechicleMock },
      });

      jest.spyOn(vehicleRepository, 'find').mockResolvedValue(vechicleMock);
      jest.spyOn(vehicleRepository, 'count').mockResolvedValue(2);

      // Act
      const result = await service.findAll(params, companyId);
      // Assert

      expect(result).toEqual(payloadResponse);
      expect(vehicleRepository.find).toHaveBeenCalledTimes(1);
      expect(vehicleRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should thow an exception', () => {
      //Mocks
      jest.spyOn(vehicleRepository, 'find').mockRejectedValueOnce(new Error());

      //Assert
      expect(service.findAll).rejects.toThrowError();
    });
  });

  describe('findOneOrFail', () => {
    it('should return a vehicle entity item succesfully!', async () => {
      // mocks
      const vehiclesMockItem = vehiclesMock[0] as VehicleEntity;
      jest
        .spyOn(vehicleRepository, 'findOneOrFail')
        .mockResolvedValue(vehiclesMockItem);

      //Act

      const result = await service.findOneOrFail(
        '651084df-b024-4d76-8968-638dbe8c3954',
        '651084df-b024-4d76-8968-638dbe8c3954',
      );

      //Assert
      expect(result).toEqual(vehiclesMockItem);
      expect(vehicleRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('Should throw a not found exception', () => {
      //Act
      jest
        .spyOn(vehicleRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.findOneOrFail(
          '651084df-b024-4d76-8968-638dbe8c3954',
          companyId,
        ),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('create', () => {
    it('Should create a new vehicle item success!', async () => {
      //Mock
      const data = vehiclesMock[0] as CreateDto;
      const vehiclesMockItem = vehiclesMock[0] as VehicleEntity;

      jest.spyOn(vehicleRepository, 'save').mockResolvedValue(vehiclesMockItem);

      jest.spyOn(vehicleRepository, 'create').mockReturnValue(vehiclesMockItem);

      //Act
      const result = await service.create(data, companyId);

      //Assert
      expect(result).toEqual(vehiclesMockItem);
      expect(vehicleRepository.create).toHaveBeenCalledTimes(1);
      expect(vehicleRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Should throw an exception', async () => {
      //Mock
      const data = vehiclesMock[0] as CreateDto;

      jest.spyOn(vehicleRepository, 'save').mockRejectedValueOnce(new Error());

      //Assert
      expect(service.create(data, companyId)).rejects.toThrowError();
    });
  });
  describe('update', () => {
    it('Should update a vehicle entity item success!', async () => {
      //Mock
      const data = vehiclesMock[0] as CreateDto;
      const vehiclesMockItem = vehiclesMock[0] as VehicleEntity;

      jest.spyOn(vehicleRepository, 'save').mockResolvedValue(vehiclesMockItem);

      jest.spyOn(vehicleRepository, 'merge').mockReturnValue(vehiclesMockItem);

      //Act
      const result = await service.update(vehiclesMockItem.id, data, companyId);

      //Assert
      expect(result).toEqual(vehiclesMockItem);
      expect(vehicleRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Should throw a not found exception', () => {
      //Act
      jest
        .spyOn(vehicleRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.findOneOrFail(
          '651084df-b024-4d76-8968-638dbe8c3954',
          companyId,
        ),
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should throw an exception', async () => {
      //Mock
      const data = vehiclesMock[0] as CreateDto;

      jest.spyOn(vehicleRepository, 'save').mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.update('651084df-b024-4d76-8968-638dbe8c3954', data, companyId),
      ).rejects.toThrowError();
    });
  });
  describe('delete', () => {
    it('Should delete by id vehicle entity success!', async () => {
      //Mock
      const vehiclesMockItem = vehiclesMock[0] as VehicleEntity;

      jest
        .spyOn(vehicleRepository, 'findOneOrFail')
        .mockResolvedValue(vehiclesMockItem);
      jest
        .spyOn(vehicleRepository, 'delete')
        .mockResolvedValue({} as DeleteResult);

      //Act
      const result = await service.deleteById(
        '651084df-b024-4d76-8968-638dbe8c3954',
        companyId,
      );
      //Assert
      expect(result).toEqual({});
      expect(vehicleRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(vehicleRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('Should throw a not found exception', () => {
      //Act
      jest
        .spyOn(vehicleRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.deleteById('651084df-b024-4d76-8968-638dbe8c3954', companyId),
      ).rejects.toThrowError(NotFoundException);
    });
    it('Should throw an exception', async () => {
      //Mock
      jest
        .spyOn(vehicleRepository, 'delete')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.deleteById('651084df-b024-4d76-8968-638dbe8c3954', companyId),
      ).rejects.toThrowError();
    });
  });
});

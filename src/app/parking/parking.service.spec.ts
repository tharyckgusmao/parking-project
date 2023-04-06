import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../company/entity/company.entity';
import { VehicleEntity } from '../vehicle/entity/vehicle.entity';
import { ParkingEntity } from './entity/parking.entity';
import { ParkingService } from './parking.service';

const vehicleId = '59079c07-f5db-4e11-b44d-80a4f31dfff4';
const companyId = '0c49aae8-698a-4a5d-b3f8-8bcf9641bf08';

const companyMock = {
  id: '0c49aae8-698a-4a5d-b3f8-8bcf9641bf08',
  name: 'tharyck',
  cnpj: '10000000000000',
  address: 'Rua henrique gorceix 1770',
  phone: '31982695343',
  qtyVacancyCars: 20,
  qtyVacancyMotors: 40,
  createdAt: '2023-04-06T19:55:57.592Z',
  updatedAt: '2023-04-06T19:55:57.592Z',
};
const vehicleMock = {
  id: '59079c07-f5db-4e11-b44d-80a4f31dfff4',
  brand: 'ford',
  model: 'v2',
  color: 'vermelho',
  plate: '123egfr',
  type: 'car',
  company_id: '0c49aae8-698a-4a5d-b3f8-8bcf9641bf08',
  createdAt: '2023-04-06T19:58:28.633Z',
  updatedAt: '2023-04-06T19:58:28.633Z',
};
const parkingMock = {
  id: '876e4139-3020-4c10-b513-f584d984b4c6',
  company_id: '0c49aae8-698a-4a5d-b3f8-8bcf9641bf08',
  vehicle_id: 'ae8524f8-0a1a-4360-8226-8d5a170d81f6',
  event: 0,
  createdAt: '2023-04-06 19:42:49.360274',
  updatedAt: '2023-04-06 19:42:49.360274',
};
describe('ParkingService', () => {
  let service: ParkingService;
  let parkingRepository: Repository<ParkingEntity>;
  let companyRepository: Repository<CompanyEntity>;
  let vehicleRepository: Repository<VehicleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingService,
        {
          provide: getRepositoryToken(ParkingEntity),
          useValue: {
            countBy: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CompanyEntity),
          useValue: {
            findOneByOrFail: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            findOneByOrFail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ParkingService);
    parkingRepository = module.get(getRepositoryToken(ParkingEntity));
    companyRepository = module.get(getRepositoryToken(CompanyEntity));
    vehicleRepository = module.get(getRepositoryToken(VehicleEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

    expect(parkingRepository).toBeDefined();
    expect(companyRepository).toBeDefined();
    expect(vehicleRepository).toBeDefined();
  });

  describe('input', () => {
    it('Should be succesfullly input vehicle on parking', async () => {
      //Mock

      const payload = { companyId, vehicleId };

      jest
        .spyOn(vehicleRepository, 'findOneByOrFail')
        .mockResolvedValue(vehicleMock as VehicleEntity);
      jest
        .spyOn(companyRepository, 'findOneByOrFail')
        .mockResolvedValue(companyMock as CompanyEntity);
      jest.spyOn(parkingRepository, 'countBy').mockResolvedValue(20);
      jest
        .spyOn(parkingRepository, 'findOne')
        .mockResolvedValue(parkingMock as ParkingEntity);

      //Act
      const result = await service.input(payload);

      //Assert
      expect(result).toEqual(undefined);
      expect(vehicleRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
      expect(companyRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
      expect(parkingRepository.countBy).toHaveBeenCalledTimes(2);
      expect(parkingRepository.findOne).toHaveBeenCalledTimes(1);
      expect(parkingRepository.save).toHaveBeenCalledTimes(1);
      expect(parkingRepository.create).toHaveBeenCalledTimes(1);
    });
    it('Should an exception thrown when inserting a vehicle already present', async () => {
      const payload = { companyId, vehicleId };

      jest
        .spyOn(vehicleRepository, 'findOneByOrFail')
        .mockResolvedValue(vehicleMock as VehicleEntity);
      jest
        .spyOn(companyRepository, 'findOneByOrFail')
        .mockResolvedValue(companyMock as CompanyEntity);
      jest.spyOn(parkingRepository, 'countBy').mockResolvedValue(20);
      jest
        .spyOn(parkingRepository, 'findOne')
        .mockResolvedValue({ ...parkingMock, event: 1 } as ParkingEntity);

      expect(service.input(payload)).rejects.toThrowError(NotFoundException);
    });
    it('Should an exception thrown when inserting if not have vancacy', async () => {
      const payload = { companyId, vehicleId };

      jest
        .spyOn(vehicleRepository, 'findOneByOrFail')
        .mockResolvedValue(vehicleMock as VehicleEntity);
      jest
        .spyOn(companyRepository, 'findOneByOrFail')
        .mockResolvedValue(companyMock as CompanyEntity);
      jest.spyOn(parkingRepository, 'countBy').mockResolvedValue(-20);
      jest
        .spyOn(parkingRepository, 'findOne')
        .mockResolvedValue({ ...parkingMock, event: 1 } as ParkingEntity);

      expect(service.input(payload)).rejects.toThrowError(NotFoundException);
    });
    it('Should an exception thrown when not exist vehicle', async () => {
      const payload = { companyId, vehicleId };

      jest
        .spyOn(vehicleRepository, 'findOneByOrFail')
        .mockRejectedValue(new Error());

      expect(service.input(payload)).rejects.toThrowError(NotFoundException);
    });
    it('Should an exception thrown when not exist company', async () => {
      const payload = { companyId, vehicleId };

      jest
        .spyOn(vehicleRepository, 'findOneByOrFail')
        .mockResolvedValue(vehicleMock as VehicleEntity);
      jest
        .spyOn(companyRepository, 'findOneByOrFail')
        .mockRejectedValue(new Error());

      expect(service.input(payload)).rejects.toThrowError(NotFoundException);
    });
  });
  describe('output', () => {
    it('Should be succesfullly output vehicle on parking', async () => {
      //Mock

      const payload = { companyId, vehicleId };

      jest
        .spyOn(vehicleRepository, 'findOneByOrFail')
        .mockResolvedValue(vehicleMock as VehicleEntity);
      jest
        .spyOn(companyRepository, 'findOneByOrFail')
        .mockResolvedValue(companyMock as CompanyEntity);
      jest.spyOn(parkingRepository, 'countBy').mockResolvedValue(20);
      jest
        .spyOn(parkingRepository, 'findOne')
        .mockResolvedValue({ ...parkingMock, event: 1 } as ParkingEntity);

      //Act
      const result = await service.output(payload);

      //Assert
      expect(result).toEqual(undefined);
      expect(vehicleRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
      expect(companyRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
      expect(parkingRepository.countBy).toHaveBeenCalledTimes(2);
      expect(parkingRepository.findOne).toHaveBeenCalledTimes(1);
      expect(parkingRepository.save).toHaveBeenCalledTimes(1);
      expect(parkingRepository.create).toHaveBeenCalledTimes(1);
    });
    it('Should an exception thrown when output a vehicle not present', async () => {
      const payload = { companyId, vehicleId };

      jest
        .spyOn(vehicleRepository, 'findOneByOrFail')
        .mockResolvedValue(vehicleMock as VehicleEntity);
      jest
        .spyOn(companyRepository, 'findOneByOrFail')
        .mockResolvedValue(companyMock as CompanyEntity);
      jest.spyOn(parkingRepository, 'countBy').mockResolvedValue(20);
      jest
        .spyOn(parkingRepository, 'findOne')
        .mockResolvedValue({ ...parkingMock, event: 0 } as ParkingEntity);

      expect(service.output(payload)).rejects.toThrowError(NotFoundException);
    });
    it('Should an exception thrown when not exist vehicle', async () => {
      const payload = { companyId, vehicleId };

      jest
        .spyOn(vehicleRepository, 'findOneByOrFail')
        .mockRejectedValue(new Error());

      expect(service.input(payload)).rejects.toThrowError(NotFoundException);
    });
    it('Should an exception thrown when not exist company', async () => {
      const payload = { companyId, vehicleId };

      jest
        .spyOn(vehicleRepository, 'findOneByOrFail')
        .mockResolvedValue(vehicleMock as VehicleEntity);
      jest
        .spyOn(companyRepository, 'findOneByOrFail')
        .mockRejectedValue(new Error());

      expect(service.input(payload)).rejects.toThrowError(NotFoundException);
    });
  });
});

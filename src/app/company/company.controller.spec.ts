import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { createResponseWithObject } from 'src/shared/utils/response';
import { DeleteResult } from 'typeorm';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CreateDto } from './dto/create.dto';
import { QueryParams } from './dto/query.dto';
import { UpdateDto } from './dto/update.dto';
import { CompanyEntity } from './entity/company.entity';
const companyMock = [
  {
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
  {
    id: '651284df-b024-4d76-8968-638dbe8c3954',
    name: 'tharyck',
    cnpj: '10000000000000',
    address: 'Rua henrique gorceix 1770',
    phone: '31982695343',
    qtyVacancyCars: 20,
    qtyVacancyMotors: 40,
    createdAt: '2023-04-05T20:29:15.473Z',
    updatedAt: '2023-04-05T20:29:15.473Z',
  },
];

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: {
            findAll: jest.fn(),
            findOneOrFail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            deleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a companies list on controller successfully', async () => {
      const companiesMock = companyMock as CompanyEntity[];
      const params = {
        current: 0,
        perPage: 10,
      };
      const total = 2;
      const payloadResponse = createResponseWithObject({
        current: params.current,
        perPage: params.perPage,
        total: total,
        items: { companies: companiesMock },
      });

      jest.spyOn(service, 'findAll').mockResolvedValue(payloadResponse);

      // Act
      const result = await controller.getAll(params);
      // Assert

      expect(result).toEqual(payloadResponse);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
    it('should on Exception', async () => {
      const params = {
        invalid_params: 0,
      } as QueryParams;
      jest.spyOn(controller, 'getAll').mockRejectedValue(new Error());

      //Assert
      expect(controller.getAll(params)).rejects.toThrowError();
    });
  });
  describe('get', () => {
    it('should return a companie per id on controller successfully', async () => {
      const payloadResponse = companyMock[0] as CompanyEntity;
      const param = {
        id: '651084df-b024-4d76-8968-638dbe8c3954',
      };

      jest.spyOn(service, 'findOneOrFail').mockResolvedValue(payloadResponse);

      // Act
      const result = await controller.get(param.id);

      // Assert

      expect(result).toEqual(payloadResponse);
      expect(service.findOneOrFail).toHaveBeenCalledTimes(1);
    });
    it('should on invalid data type id Exception', async () => {
      const param = {
        id: '1',
      };

      jest.spyOn(controller, 'get').mockRejectedValue(new Error());

      //Assert
      expect(controller.get(param.id)).rejects.toThrowError();
    });
  });
  describe('create', () => {
    it('should return a new companie on controller successfully', async () => {
      const payloadResponse = companyMock[0] as CompanyEntity;
      const payloadBody = {
        name: 'tharyck',
        cnpj: '10000000000000',
        address: 'Rua henrique gorceix 1770',
        phone: '31982695343',
        qtyVacancyCars: 20,
        qtyVacancyMotors: 20,
      };

      const payloadBodyDto = plainToInstance(CreateDto, payloadBody);
      const errors = await validate(payloadBodyDto);
      jest.spyOn(service, 'create').mockResolvedValue(payloadResponse);

      // Act
      const result = await controller.create(payloadBodyDto);

      // Assert
      expect(errors.length).toEqual(0);
      expect(result).toEqual(payloadResponse);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
    it('should on invalid data body Exception', async () => {
      const payloadBody = {
        cnpj: '10000000000000',
        address: 'Rua henrique gorceix 1770',
        phone: '31982695343',
        qtyVacancyCars: 20,
        qtyVacancyMotors: -20,
      };

      const payloadBodyDto = plainToInstance(CreateDto, payloadBody);
      const errors = await validate(payloadBodyDto);

      // Assert
      expect(errors.length).not.toBe(0);
      expect(service.create).toHaveBeenCalledTimes(0);
    });
  });
  describe('update', () => {
    it('should return a update companie on controller successfully', async () => {
      const payloadResponse = companyMock[0] as CompanyEntity;
      const param = '651084df-b024-4d76-8968-638dbe8c3954';
      const payloadBody = {
        name: 'tharyck',
        cnpj: '10000000000000',
        address: 'Rua henrique gorceix 1770',
        phone: '31982695343',
        qtyVacancyCars: 20,
        qtyVacancyMotors: 20,
      };

      const payloadBodyDto = plainToInstance(UpdateDto, payloadBody);
      const errors = await validate(payloadBodyDto);
      jest.spyOn(service, 'update').mockResolvedValue(payloadResponse);

      // Act
      const result = await controller.update(param, payloadBodyDto);

      // Assert
      expect(errors.length).toEqual(0);
      expect(result).toEqual(payloadResponse);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
    it('should on invalid data body Exception', async () => {
      const payloadBody = {
        cnpj: 123,
        address: 123,
        phone: 123,
        qtyVacancyCars: -20,
        qtyVacancyMotors: -20,
      };

      const payloadBodyDto = plainToInstance(UpdateDto, payloadBody);
      const errors = await validate(payloadBodyDto);

      // Assert
      expect(errors.length).not.toBe(0);
      expect(service.update).toHaveBeenCalledTimes(0);
    });
    it('should on not exist companie Exception', async () => {
      const param = '1';

      const payloadBody = {
        name: 'tharyck',
        cnpj: '10000000000000',
        address: 'Rua henrique gorceix 1770',
        phone: '31982695343',
        qtyVacancyCars: 20,
        qtyVacancyMotors: 20,
      };

      const payloadBodyDto = plainToInstance(UpdateDto, payloadBody);
      const errors = await validate(payloadBodyDto);

      jest.spyOn(controller, 'update').mockRejectedValue(new Error());

      // Assert
      expect(errors.length).toEqual(0);

      expect(controller.update(param, payloadBody)).rejects.toThrowError();
      expect(service.update).toHaveBeenCalledTimes(0);
    });
  });
  describe('delete', () => {
    it('should return empty on deleted company controller successfully', async () => {
      const param = {
        id: '651084df-b024-4d76-8968-638dbe8c3954',
      };

      jest.spyOn(service, 'deleteById').mockResolvedValue({} as DeleteResult);

      // Act
      const result = await controller.delete(param.id);

      // Assert

      expect(result).toEqual(undefined);
    });
    it('should on invalid data type id Exception', async () => {
      const param = {
        id: '1',
      };

      jest.spyOn(controller, 'delete').mockRejectedValue(new Error());

      //Assert
      expect(controller.delete(param.id)).rejects.toThrowError();
    });
  });
});

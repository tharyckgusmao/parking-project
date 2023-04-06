import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { createResponseWithObject } from 'src/shared/utils/response';
import { DeleteResult } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { QueryParams } from './dto/query.dto';
import { UpdateDto } from './dto/update.dto';
import { VehicleEntity } from './entity/vehicle.entity';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { REQUEST } from '@nestjs/core';
const req = {
  user: '323e779b-6e5f-41bc-8112-58f115c3c2a3',
  company_id: '323e779b-6e5f-41bc-8112-58f115c3c2a3',
};

const vehicleMock = [
  {
    brand: 'ford',
    model: 'v2',
    color: 'vermelho',
    plate: '123egfr',
    type: 'car',
    id: '3fc58713-0b88-41b7-8c1c-3bc4f8909c84',
    createdAt: '2023-04-06T05:08:20.793Z',
    updatedAt: '2023-04-06T05:08:20.793Z',
  },
  {
    brand: 'ford',
    model: 'v2',
    color: 'vermelho',
    plate: '123egfr',
    type: 'car',
    id: '3fc58713-0b88-42b7-8c1c-3bc4f8909c84',
    createdAt: '2023-04-06T05:08:20.793Z',
    updatedAt: '2023-04-06T05:08:20.793Z',
  },
];

describe('VehicleController', () => {
  let controller: VehicleController;
  let service: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
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

    controller = module.get<VehicleController>(VehicleController);
    service = module.get(VehicleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a vehicles list on controller successfully', async () => {
      const vehiclesMock = vehicleMock as VehicleEntity[];
      const params = {
        current: 0,
        perPage: 10,
      };
      const total = 2;
      const payloadResponse = createResponseWithObject({
        current: params.current,
        perPage: params.perPage,
        total: total,
        items: { vehicles: vehiclesMock },
      });

      jest.spyOn(service, 'findAll').mockResolvedValue(payloadResponse);

      // Act
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await controller.getAll(params, req);
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(controller.getAll(params, req)).rejects.toThrowError();
    });
  });
  describe('get', () => {
    it('should return a vehicle per id on controller successfully', async () => {
      const payloadResponse = vehicleMock[0] as VehicleEntity;
      const param = {
        id: '651084df-b024-4d76-8968-638dbe8c3954',
      };

      jest.spyOn(service, 'findOneOrFail').mockResolvedValue(payloadResponse);

      // Act
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await controller.get(param.id, req);

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(controller.get(param.id, req)).rejects.toThrowError();
    });
  });
  describe('create', () => {
    it('should return a new vehicle on controller successfully', async () => {
      const payloadResponse = vehicleMock[0] as VehicleEntity;
      const payloadBody = {
        brand: 'ford',
        model: 'v2',
        color: 'vermelho',
        plate: '123egfr',
        type: 'car',
      };

      const payloadBodyDto = plainToInstance(CreateDto, payloadBody);
      const errors = await validate(payloadBodyDto);
      jest.spyOn(service, 'create').mockResolvedValue(payloadResponse);

      // Act
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await controller.create(payloadBodyDto, req);

      // Assert
      expect(errors.length).toEqual(0);
      expect(result).toEqual(payloadResponse);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
    it('should on invalid data body Exception', async () => {
      const payloadBody = {
        brand: 'ford',
        model: 'v2',
        color: 'vermelho',
        plate: '123egfr',
        type: 'bike',
      };

      const payloadBodyDto = plainToInstance(CreateDto, payloadBody);
      const errors = await validate(payloadBodyDto);
      // Assert
      expect(errors.length).not.toBe(0);
      expect(service.create).toHaveBeenCalledTimes(0);
    });
  });
  describe('update', () => {
    it('should return a update vehicle on controller successfully', async () => {
      const payloadResponse = vehicleMock[0] as VehicleEntity;
      const param = '651084df-b024-4d76-8968-638dbe8c3954';
      const payloadBody = {
        brand: 'ford',
        model: 'v2',
        color: 'vermelho',
        plate: '123egfr',
        type: 'car',
      };

      const payloadBodyDto = plainToInstance(UpdateDto, payloadBody);
      const errors = await validate(payloadBodyDto);
      jest.spyOn(service, 'update').mockResolvedValue(payloadResponse);

      // Act
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await controller.update(param, payloadBodyDto, req);

      // Assert
      expect(errors.length).toEqual(0);
      expect(result).toEqual(payloadResponse);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
    it('should on invalid data body Exception', async () => {
      const payloadBody = {
        brand: 'ford',
        model: 'v2',
        color: 'vermelho',
        plate: '123egfr',
        type: 'bike',
      };

      const payloadBodyDto = plainToInstance(UpdateDto, payloadBody);
      const errors = await validate(payloadBodyDto);

      // Assert
      expect(errors.length).not.toBe(0);
      expect(service.update).toHaveBeenCalledTimes(0);
    });
    it('should on not exist vehicle Exception', async () => {
      const param = '1';

      const payloadBody = {
        brand: 'ford',
        model: 'v2',
        color: 'vermelho',
        plate: '123egfr',
        type: 'car',
      };

      const payloadBodyDto = plainToInstance(UpdateDto, payloadBody);
      const errors = await validate(payloadBodyDto);

      jest.spyOn(controller, 'update').mockRejectedValue(new Error());

      // Assert
      expect(errors.length).toEqual(0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(controller.update(param, payloadBody, req)).rejects.toThrowError();
      expect(service.update).toHaveBeenCalledTimes(0);
    });
  });
  describe('delete', () => {
    it('should return empty on deleted vehicle controller successfully', async () => {
      const param = {
        id: '651084df-b024-4d76-8968-638dbe8c3954',
      };

      jest.spyOn(service, 'deleteById').mockResolvedValue({} as DeleteResult);

      // Act
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await controller.delete(param.id, req);

      // Assert

      expect(result).toEqual(undefined);
    });
    it('should on invalid data type id Exception', async () => {
      const param = {
        id: '1',
      };

      jest.spyOn(controller, 'delete').mockRejectedValue(new Error());

      //Assert
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(controller.delete(param.id, req)).rejects.toThrowError();
    });
  });
});

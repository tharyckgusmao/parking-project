import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult } from 'typeorm';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
const vehicleId = '59079c07-f5db-4e11-b44d-80a4f31dfff4';
const companyId = '0c49aae8-698a-4a5d-b3f8-8bcf9641bf08';
describe('ParkingController', () => {
  let controller: ParkingController;
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingController],
      providers: [
        {
          provide: ParkingService,
          useValue: {
            input: jest.fn(),
            output: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ParkingController>(ParkingController);
    service = module.get(ParkingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('input', () => {
    it('should return input successfully', async () => {
      jest.spyOn(service, 'input').mockResolvedValue();

      // Act
      const result = await controller.input(companyId, vehicleId);

      // Assert

      expect(result).toEqual(undefined);
    });
    it('should on invalid data type id Exception', async () => {
      jest.spyOn(service, 'input').mockRejectedValue(new Error());

      //Assert
      expect(controller.input(companyId, vehicleId)).rejects.toThrowError();
    });
  });
  describe('output', () => {
    it('should return output successfully', async () => {
      jest.spyOn(service, 'output').mockResolvedValue();

      // Act
      const result = await controller.input(companyId, vehicleId);

      // Assert

      expect(result).toEqual(undefined);
    });
    it('should on invalid data type id Exception', async () => {
      jest.spyOn(service, 'output').mockRejectedValue(new Error());

      //Assert
      expect(controller.output(companyId, vehicleId)).rejects.toThrowError();
    });
  });
});
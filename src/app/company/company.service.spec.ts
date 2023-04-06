import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createResponseWithObject, Response } from 'src/shared/utils/response';
import { DeleteResult, Repository } from 'typeorm';
import { CompanyService } from './company.service';
import { CreateDto } from './dto/create.dto';
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

describe('CompanyService', () => {
  let service: CompanyService;
  let companyRepository: Repository<CompanyEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(CompanyEntity),
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

    service = module.get(CompanyService);
    companyRepository = module.get(getRepositoryToken(CompanyEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(companyRepository).toBeDefined();
  });
  describe('findAll', () => {
    it('should return a companies list entity successfully', async () => {
      //mock
      const companiesMock = companyMock as CompanyEntity[];
      const params = {
        current: 0,
        perPage: 10,
      };
      const total = 2;
      const payloadResponse: Response = createResponseWithObject({
        current: params.current,
        perPage: params.perPage,
        total: total,
        items: { companies: companiesMock },
      });

      jest.spyOn(companyRepository, 'find').mockResolvedValue(companiesMock);
      jest.spyOn(companyRepository, 'count').mockResolvedValue(2);

      // Act
      const result = await service.findAll(params);
      // Assert

      expect(result).toEqual(payloadResponse);
      expect(companyRepository.find).toHaveBeenCalledTimes(1);
      expect(companyRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should thow an exception', () => {
      //Mocks
      jest.spyOn(companyRepository, 'find').mockRejectedValueOnce(new Error());

      //Assert
      expect(service.findAll).rejects.toThrowError();
    });
  });

  describe('findOneOrFail', () => {
    it('should return a company entity item succesfully!', async () => {
      // mocks
      const companiesMockItem = companyMock[0] as CompanyEntity;
      jest
        .spyOn(companyRepository, 'findOneOrFail')
        .mockResolvedValue(companiesMockItem);

      //Act

      const result = await service.findOneOrFail(
        '651084df-b024-4d76-8968-638dbe8c3954',
      );

      //Assert
      expect(result).toEqual(companiesMockItem);
      expect(companyRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('Should throw a not found exception', () => {
      //Act
      jest
        .spyOn(companyRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.findOneOrFail('651084df-b024-4d76-8968-638dbe8c3954'),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('create', () => {
    it('Should create a new company item success!', async () => {
      //Mock
      const data = companyMock[0] as CreateDto;
      const companiesMockItem = companyMock[0] as CompanyEntity;

      jest
        .spyOn(companyRepository, 'save')
        .mockResolvedValue(companiesMockItem);

      jest
        .spyOn(companyRepository, 'create')
        .mockReturnValue(companiesMockItem);

      //Act
      const result = await service.create(data);

      //Assert
      expect(result).toEqual(companiesMockItem);
      expect(companyRepository.create).toHaveBeenCalledTimes(1);
      expect(companyRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Should throw an exception', async () => {
      //Mock
      const data = companyMock[0] as CreateDto;

      jest.spyOn(companyRepository, 'save').mockRejectedValueOnce(new Error());

      //Assert
      expect(service.create(data)).rejects.toThrowError();
    });
  });
  describe('update', () => {
    it('Should update a company entity item success!', async () => {
      //Mock
      const data = companyMock[0] as CreateDto;
      const companiesMockItem = companyMock[0] as CompanyEntity;

      jest
        .spyOn(companyRepository, 'save')
        .mockResolvedValue(companiesMockItem);

      jest.spyOn(companyRepository, 'merge').mockReturnValue(companiesMockItem);

      //Act
      const result = await service.update(companiesMockItem.id, data);

      //Assert
      expect(result).toEqual(companiesMockItem);
      expect(companyRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Should throw a not found exception', () => {
      //Act
      jest
        .spyOn(companyRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.findOneOrFail('651084df-b024-4d76-8968-638dbe8c3954'),
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should throw an exception', async () => {
      //Mock
      const data = companyMock[0] as CreateDto;

      jest.spyOn(companyRepository, 'save').mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.update('651084df-b024-4d76-8968-638dbe8c3954', data),
      ).rejects.toThrowError();
    });
  });
  describe('delete', () => {
    it('Should delete by id company entity success!', async () => {
      //Mock
      const companiesMockItem = companyMock[0] as CompanyEntity;

      jest
        .spyOn(companyRepository, 'findOneOrFail')
        .mockResolvedValue(companiesMockItem);
      jest
        .spyOn(companyRepository, 'delete')
        .mockResolvedValue({} as DeleteResult);

      //Act
      const result = await service.deleteById(
        '651084df-b024-4d76-8968-638dbe8c3954',
      );
      //Assert
      expect(result).toEqual({});
      expect(companyRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(companyRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('Should throw a not found exception', () => {
      //Act
      jest
        .spyOn(companyRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.deleteById('651084df-b024-4d76-8968-638dbe8c3954'),
      ).rejects.toThrowError(NotFoundException);
    });
    it('Should throw an exception', async () => {
      //Mock
      jest
        .spyOn(companyRepository, 'delete')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(
        service.deleteById('651084df-b024-4d76-8968-638dbe8c3954'),
      ).rejects.toThrowError();
    });
  });
});

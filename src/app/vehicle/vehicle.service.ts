import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEnum } from 'src/shared/dto/orderParam';
import { createResponseWithObject } from 'src/shared/utils/response';
import { Equal, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { VehicleEntity } from './entity/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async findAll(
    { current = 0, order = OrderEnum.ASC, perPage = 10, sort = 'createdAt' },
    companyId: string,
  ) {
    const vehicles = await this.vehicleRepository.find({
      where: {
        company: Equal(companyId),
      },
      order: {
        [sort]: order,
      },
      skip: current,
      take: perPage,
    });

    const total = await this.vehicleRepository.count();
    return createResponseWithObject({
      current: Number(current),
      perPage: Number(perPage),
      total,
      items: { vehicles },
    });
  }

  async findOneOrFail(id: string, companyId: string) {
    try {
      return await this.vehicleRepository.findOneOrFail({
        where: { id, company: Equal(companyId) },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async create(data: CreateDto, companyId: string) {
    return await this.vehicleRepository.save(
      this.vehicleRepository.create({ ...data, company_id: companyId }),
    );
  }
  async update(id: string, data: CreateDto, companyId: string) {
    const vehicle = await this.findOneOrFail(id, companyId);
    this.vehicleRepository.merge(vehicle, data);
    return await this.vehicleRepository.save(vehicle);
  }
  async deleteById(id: string, companyId: string) {
    await this.findOneOrFail(id, companyId);
    return await this.vehicleRepository.delete(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEnum } from 'src/shared/dto/orderParam';
import { createResponseWithObject } from 'src/shared/utils/response';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { VehicleEntity } from './entity/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async findAll({
    current = 0,
    order = OrderEnum.ASC,
    perPage = 10,
    sort = 'createdAt',
  }) {
    const vehicles = await this.vehicleRepository.find({
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

  async findOneOrFail(id: string) {
    try {
      return await this.vehicleRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async create(data: CreateDto) {
    return await this.vehicleRepository.save(
      this.vehicleRepository.create(data),
    );
  }
  async update(id: string, data: CreateDto) {
    const vehicle = await this.findOneOrFail(id);
    this.vehicleRepository.merge(vehicle, data);
    return await this.vehicleRepository.save(vehicle);
  }
  async deleteById(id: string) {
    await this.findOneOrFail(id);
    return await this.vehicleRepository.delete(id);
  }
}

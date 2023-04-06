import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEnum } from 'src/shared/dto/orderParam';
import { createResponseWithObject } from 'src/shared/utils/response';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { CompanyEntity } from './entity/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async findAll({
    current = 0,
    order = OrderEnum.ASC,
    perPage = 10,
    sort = 'createdAt',
  }) {
    const companies = await this.companyRepository.find({
      order: {
        [sort]: order,
      },
      skip: current,
      take: perPage,
    });

    const total = await this.companyRepository.count();
    return createResponseWithObject({
      current: Number(current),
      perPage: Number(perPage),
      total,
      items: { companies },
    });
  }

  async findOneOrFail(id: string) {
    try {
      return await this.companyRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async create(data: CreateDto) {
    return await this.companyRepository.save(
      this.companyRepository.create(data),
    );
  }
  async update(id: string, data: CreateDto) {
    const company = await this.findOneOrFail(id);
    this.companyRepository.merge(company, data);
    return await this.companyRepository.save(company);
  }
  async deleteById(id: string) {
    await this.findOneOrFail(id);
    return await this.companyRepository.delete(id);
  }
}

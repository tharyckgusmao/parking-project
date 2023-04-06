import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEnum } from 'src/shared/dto/orderParam';
import { createResponseWithObject } from 'src/shared/utils/response';
import { Not, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { UserEntity } from './entity/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll({
    current = 0,
    order = OrderEnum.ASC,
    perPage = 10,
    sort = 'createdAt',
  }) {
    const users = await this.userRepository.find({
      order: {
        [sort]: order,
      },
      skip: current,
      take: perPage,
      relations: { company: true },
    });

    const total = await this.userRepository.count();
    return createResponseWithObject({
      current: Number(current),
      perPage: Number(perPage),
      total,
      items: { users },
    });
  }

  async findOneOrFail(id: string) {
    try {
      return await this.userRepository.findOneOrFail({
        where: { id },
        relations: { company: true },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async create(data: CreateDto) {
    const count = await this.userRepository.count({
      where: { email: data.email },
    });

    if (count > 0) throw new BadRequestException('Email already in use');

    return await this.userRepository.save(this.userRepository.create(data));
  }
  async update(id: string, data: UpdateDto) {
    const user = await this.findOneOrFail(id);

    const checkExist = await this.userRepository.findOne({
      where: { id: Not(id), email: data.email },
      select: ['email', 'id'],
    });

    if (checkExist?.email === data?.email && checkExist?.id !== user?.id) {
      throw new BadRequestException('Email already in use');
    }

    this.userRepository.merge(user, data);
    return await this.userRepository.save(user);
  }
  async deleteById(id: string) {
    await this.findOneOrFail(id);
    return await this.userRepository.delete(id);
  }
}

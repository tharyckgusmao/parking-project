import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class OrderParam {
  @IsEnum(OrderEnum, { message: 'order needs to be asc or desc' })
  @IsOptional()
  @ApiPropertyOptional({ default: 'ASC' })
  order?: OrderEnum;
}

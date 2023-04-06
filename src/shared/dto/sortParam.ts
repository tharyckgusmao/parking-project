import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SortParam {
  @IsOptional()
  @ApiPropertyOptional({ default: 'createdAt' })
  sort?: string;
}

import { Min, IsNumber, IsOptional, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  current?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(20)
  perPage?: number;
}

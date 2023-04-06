import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @MaxLength(14)
  @ApiProperty()
  cnpj: string;

  @IsOptional()
  @MaxLength(500)
  @ApiProperty()
  address: string;

  @IsOptional()
  @MaxLength(11)
  @MinLength(10)
  @ApiProperty()
  phone: string;

  @IsOptional()
  @Max(999)
  @Min(0)
  @ApiProperty()
  qtyVacancyCars: number;

  @IsOptional()
  @Max(999)
  @Min(0)
  @ApiProperty()
  qtyVacancyMotors: number;
}

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
  name: string;

  @IsOptional()
  @MaxLength(14)
  cnpj: string;

  @IsOptional()
  @MaxLength(500)
  address: string;

  @IsOptional()
  @MaxLength(11)
  @MinLength(10)
  phone: string;

  @IsOptional()
  @Max(999)
  @Min(0)
  qtyVacancyCars: number;

  @IsOptional()
  @Max(999)
  @Min(0)
  qtyVacancyMotors: number;
}

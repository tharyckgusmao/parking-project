import { IsNotEmpty, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MaxLength(14)
  cnpj: string;

  @IsNotEmpty()
  @MaxLength(500)
  address: string;

  @IsNotEmpty()
  @MaxLength(11)
  @MinLength(10)
  phone: string;

  @IsNotEmpty()
  @Max(999)
  @Min(0)
  qtyVacancyCars: number;

  @IsNotEmpty()
  @Max(999)
  @Min(0)
  qtyVacancyMotors: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, MaxLength, Min, MinLength } from 'class-validator';
import ApiSchema from 'src/shared/decorator/ApiSchemaDecorator';
@ApiSchema({ name: 'CompanyCreateDto' })
export class CreateDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @MaxLength(14)
  @ApiProperty()
  cnpj: string;

  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty()
  address: string;

  @IsNotEmpty()
  @MaxLength(11)
  @MinLength(10)
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @Max(999)
  @Min(0)
  @ApiProperty()
  qtyVacancyCars: number;

  @IsNotEmpty()
  @Max(999)
  @Min(0)
  @ApiProperty()
  qtyVacancyMotors: number;
}

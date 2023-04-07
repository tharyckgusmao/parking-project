import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import ApiSchema from 'src/shared/decorator/ApiSchemaDecorator';
export enum vehicleEnum {
  CAR = 'car',
  MOTORBIKE = 'motorbike',
}
@ApiSchema({ name: 'VehicleCreateDto' })
export class CreateDto {
  @IsNotEmpty()
  @ApiProperty()
  brand: string;

  @IsNotEmpty()
  @ApiProperty()
  model: string;

  @IsNotEmpty()
  @ApiProperty()
  color: string;

  @IsNotEmpty()
  @MaxLength(7)
  @ApiProperty()
  plate: string;

  @IsEnum(vehicleEnum, { message: 'needs to a valid vehicle' })
  @IsNotEmpty()
  @ApiProperty()
  type: string;
}

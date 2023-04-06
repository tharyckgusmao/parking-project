import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
export enum vehicleEnum {
  CAR = 'car',
  MOTORBIKE = 'motorbike',
}
export class CreateDto {
  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  model: string;

  @IsNotEmpty()
  color: string;

  @IsNotEmpty()
  @MaxLength(7)
  plate: string;

  @IsEnum(vehicleEnum, { message: 'needs to a valid vehicle' })
  @IsNotEmpty()
  type: string;
}

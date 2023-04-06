import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { vehicleEnum } from './create.dto';

export class UpdateDto {
  @IsOptional()
  brand: string;

  @IsOptional()
  model: string;

  @IsOptional()
  color: string;

  @IsOptional()
  @MaxLength(7)
  plate: string;

  @IsOptional()
  @IsEnum(vehicleEnum, { message: 'needs to a valid vehicle' })
  type: string;
}

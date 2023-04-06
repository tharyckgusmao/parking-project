import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { vehicleEnum } from './create.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {
  @IsOptional()
  @ApiProperty()
  brand: string;

  @IsOptional()
  @ApiProperty()
  model: string;

  @IsOptional()
  @ApiProperty()
  color: string;

  @IsOptional()
  @MaxLength(7)
  @ApiProperty()
  plate: string;

  @IsOptional()
  @IsEnum(vehicleEnum, { message: 'needs to a valid vehicle' })
  @ApiProperty()
  type: string;
}

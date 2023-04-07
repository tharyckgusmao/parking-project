import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class FilterDto {
  @IsOptional()
  @ApiProperty()
  range: string;

  @IsOptional()
  @ApiProperty()
  startOfDate: string;

  @IsOptional()
  @ApiProperty()
  endOfDate: string;
}

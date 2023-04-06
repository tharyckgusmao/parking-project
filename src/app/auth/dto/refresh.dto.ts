import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}

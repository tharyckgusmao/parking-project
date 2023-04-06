import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/app/user/entity/user.entity';

export class LoginDoc {
  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  accessTokenExpiresIn: number;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  refreshTokenExpiresIn: number;
}

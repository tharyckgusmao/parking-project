import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

export interface ILoginReturn {
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

interface IValidateReturn {
  user?: UserEntity | null;
  isValid: boolean;
}

interface IValidateTokenOptions {
  token: string;
  type: 'access' | 'refresh';
}

interface IJWTDecodedPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  private async generateNewAccessToken(user: UserEntity) {
    const accessToken = jwt.sign(
      {},
      this.configService.get('ACCESS_JWT_SECRET', '123'),
      {
        subject: user.id,
        expiresIn: `${this.configService.get('ACCESS_TOKEN_TTL', 60)}s`,
      },
    );

    return accessToken;
  }

  private async generateNewRefreshToken(user: UserEntity) {
    const refreshToken = jwt.sign(
      {},
      this.configService.get('REFRESH_JWT_SECRET', '123'),
      {
        subject: user.id,
        expiresIn: `${this.configService.get('REFRESH_TOKEN_TTL', 60)}s`,
      },
    );

    return refreshToken;
  }

  async login({ email, password }: LoginDto): Promise<ILoginReturn> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) throw new BadRequestException('User not exist');

    const result = await bcrypt.compare(password, user.password);

    if (!result) throw new BadRequestException('invalid credentials');

    const accessToken = await this.generateNewAccessToken(user);

    const refreshToken = await this.generateNewRefreshToken(user);

    return {
      user,
      accessToken: accessToken,
      accessTokenExpiresIn: Number(
        this.configService.get('ACCESS_TOKEN_TTL', 60),
      ),
      refreshToken: refreshToken,
      refreshTokenExpiresIn: Number(
        this.configService.get('REFRESH_TOKEN_TTL'),
      ),
    };
  }

  async refresh({ refreshToken }: RefreshDto): Promise<ILoginReturn> {
    const { isValid, user } = await this.validateToken({
      token: refreshToken,
      type: 'refresh',
    });

    if (!(isValid && user)) throw new BadRequestException('Token Invalid');

    const newAccessToken = await this.generateNewAccessToken(user);

    const newRefreshToken = await this.generateNewRefreshToken(user);

    return {
      user: user,
      accessToken: newAccessToken,
      accessTokenExpiresIn: Number(
        this.configService.get('ACCESS_TOKEN_TTL', 60),
      ),
      refreshToken: newRefreshToken,
      refreshTokenExpiresIn: Number(
        this.configService.get('REFRESH_TOKEN_TTL', 60),
      ),
    };
  }

  async validateToken({
    token,
    type,
  }: IValidateTokenOptions): Promise<IValidateReturn> {
    try {
      const typeConfing =
        type === 'access' ? 'ACCESS_JWT_SECRET' : 'REFRESH_JWT_SECRET';
      const { sub } = jwt.verify(
        token,
        this.configService.get(typeConfing, '123'),
      ) as IJWTDecodedPayload;

      const user = await this.userRepository.findOneBy({ id: sub });

      return { isValid: true, user };
    } catch (error) {
      return { isValid: false };
    }
  }
}

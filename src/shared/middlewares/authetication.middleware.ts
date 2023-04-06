import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization) throw new UnauthorizedException('Missing Token');

    const [, token] = authorization.split('Bearer ');

    const { user, isValid } = await this.authService.validateToken({
      token,
      type: 'access',
    });

    if (!(isValid && user)) throw new UnauthorizedException('Invalid Token');

    req.user = {
      id: user.id,
      company_id: user.company_id,
    };

    next();
  }
}

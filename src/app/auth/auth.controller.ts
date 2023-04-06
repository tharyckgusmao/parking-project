import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RefreshDoc } from './docs/refresh.doc';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LoginDoc } from './docs/login.doc';

@Controller('api/v1/auth')
@ApiTags('Authenticate')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Efetuar login' })
  @ApiResponse({
    status: 200,
    description: 'Login efetuado com sucesso',
    type: LoginDoc,
  })
  @ApiResponse({ status: 401, description: 'Parâmetros Inválidos' })
  @ApiResponse({ status: 400, description: 'Parâmetros Inválidos' })
  login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto);
  }

  @Post('/refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh de Token' })
  @ApiResponse({
    status: 200,
    description: 'Refresh de token com sucesso',
    type: RefreshDoc,
  })
  @ApiResponse({ status: 401, description: 'Parâmetros Inválidos' })
  @ApiResponse({ status: 400, description: 'Parâmetros Inválidos' })
  refresh(@Body() refreshDto: RefreshDto): Promise<any> {
    return this.authService.refresh(refreshDto);
  }
}

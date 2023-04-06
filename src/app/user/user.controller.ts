import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { QueryParams } from './dto/query.dto';
import { UpdateDto } from './dto/update.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllDoc } from './docs/getAll.doc';
import { GetDoc } from './docs/get.doc';
import { CreateDoc } from './docs/create.doc';
import { UpdateDoc } from './docs/update.doc';

@Controller('api/v1/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos veiculos',
    type: GetAllDoc,
    isArray: true,
  })
  async getAll(@Query() query: QueryParams) {
    return await this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Exibe um usuario' })
  @ApiResponse({
    status: 200,
    description: 'Dados de um usuario',
    type: GetDoc,
  })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOneOrFail(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuario' })
  @ApiResponse({
    status: 200,
    description: 'Criação realizada com sucesso',
    type: CreateDoc,
  })
  async create(@Body() body: CreateDto) {
    return await this.userService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma usuario' })
  @ApiResponse({
    status: 200,
    description: 'usuario atualizada com sucesso',
    type: UpdateDoc,
  })
  @ApiResponse({ status: 404, description: 'usuario não encontrada' })
  @ApiResponse({ status: 400, description: 'Parâmetros Inválidos' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateDto,
  ) {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta uma Usuario' })
  @ApiResponse({ status: 200, description: 'Usuario excluida com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuario não encontrada' })
  @ApiResponse({ status: 400, description: 'Parâmetros Inválidos' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.deleteById(id);
  }
}

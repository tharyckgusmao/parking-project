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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateDoc } from './docs/create.doc';
import { GetDoc } from './docs/get.doc';
import { GetAllDoc } from './docs/getAll.doc';
import { UpdateDoc } from './docs/update.doc';
import { CreateDto } from './dto/create.dto';
import { QueryParams } from './dto/query.dto';

@Controller('/api/v1/company')
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas companias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas companias',
    type: GetAllDoc,
    isArray: true,
  })
  async getAll(@Query() query: QueryParams) {
    return await this.companyService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Exibe uma compania' })
  @ApiResponse({
    status: 200,
    description: 'Dados de uma companias',
    type: GetDoc,
  })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.companyService.findOneOrFail(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova compania' })
  @ApiResponse({
    status: 200,
    description: 'Criação realizada com sucesso',
    type: CreateDoc,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros Inválidos' })
  async create(@Body() body: CreateDto) {
    return await this.companyService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma compania' })
  @ApiResponse({
    status: 200,
    description: 'Compania atualizada com sucesso',
    type: UpdateDoc,
  })
  @ApiResponse({ status: 404, description: 'Compania não encontrada' })
  @ApiResponse({ status: 400, description: 'Parâmetros Inválidos' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateDto,
  ) {
    return await this.companyService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta uma compania' })
  @ApiResponse({ status: 200, description: 'Compania excluida com sucesso' })
  @ApiResponse({ status: 404, description: 'Compania não encontrada' })
  @ApiResponse({ status: 400, description: 'Parâmetros Inválidos' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.companyService.deleteById(id);
  }
}

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
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateDto } from './dto/create.dto';
import { QueryParams } from './dto/query.dto';
import { VehicleService } from './vehicle.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetAllDoc } from './docs/getAll.doc';
import { GetDoc } from './docs/get.doc';
import { CreateDoc } from './docs/create.doc';
import { UpdateDoc } from './docs/update.doc';

@Controller('/api/v1/vehicle')
@ApiTags('Vehicle')
@ApiBearerAuth()
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}
  @Get()
  @ApiOperation({ summary: 'Lista todos veiculos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos veiculos',
    type: GetAllDoc,
    isArray: true,
  })
  async getAll(@Query() query: QueryParams, @Req() req: Request) {
    const { company_id: companyId } = req.user;
    return await this.vehicleService.findAll(query, companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Exibe um veiculo1' })
  @ApiResponse({
    status: 200,
    description: 'Dados de um veiculo',
    type: GetDoc,
  })
  async get(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const { company_id: companyId } = req.user;

    return await this.vehicleService.findOneOrFail(id, companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova veiculo' })
  @ApiResponse({
    status: 200,
    description: 'Criação realizada com sucesso',
    type: CreateDoc,
  })
  async create(@Body() body: CreateDto, @Req() req: Request) {
    const { company_id: companyId } = req.user;

    return await this.vehicleService.create(body, companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma Veiculo' })
  @ApiResponse({
    status: 200,
    description: 'Veiculo atualizada com sucesso',
    type: UpdateDoc,
  })
  @ApiResponse({ status: 404, description: 'Veiculo não encontrada' })
  @ApiResponse({ status: 400, description: 'Parâmetros Inválidos' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateDto,
    @Req() req: Request,
  ) {
    const { company_id: companyId } = req.user;

    return await this.vehicleService.update(id, body, companyId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta uma Veiculo' })
  @ApiResponse({ status: 200, description: 'Veiculo excluida com sucesso' })
  @ApiResponse({ status: 404, description: 'Veiculo não encontrada' })
  @ApiResponse({ status: 400, description: 'Parâmetros Inválidos' })
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const { company_id: companyId } = req.user;

    await this.vehicleService.deleteById(id, companyId);
  }
}

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

@Controller('/api/v1/vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}
  @Get()
  async getAll(@Query() query: QueryParams, @Req() req: Request) {
    const { company_id: companyId } = req.user;
    return await this.vehicleService.findAll(query, companyId);
  }

  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const { company_id: companyId } = req.user;

    return await this.vehicleService.findOneOrFail(id, companyId);
  }

  @Post()
  async create(@Body() body: CreateDto, @Req() req: Request) {
    const { company_id: companyId } = req.user;

    return await this.vehicleService.create(body, companyId);
  }

  @Put(':id')
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
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const { company_id: companyId } = req.user;

    await this.vehicleService.deleteById(id, companyId);
  }
}

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
import { VehicleService } from './vehicle.service';

@Controller('/api/v1/vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}
  @Get()
  async getAll(@Query() query: QueryParams) {
    return await this.vehicleService.findAll(query);
  }

  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.vehicleService.findOneOrFail(id);
  }

  @Post()
  async create(@Body() body: CreateDto) {
    return await this.vehicleService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateDto,
  ) {
    return await this.vehicleService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.vehicleService.deleteById(id);
  }
}

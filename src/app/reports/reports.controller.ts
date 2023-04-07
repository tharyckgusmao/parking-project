import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { FilterDto } from './dto/filter.dto';
import { ReportsService } from './reports.service';

@Controller('/api/v1/reports')
@ApiTags('reports')
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('company/:companyId/vehicle/:vehicleId')
  async getGroupingTotal(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Req() req: Request,
    @Query() filter: FilterDto,
  ) {
    const { company_id } = req.user;
    if (company_id != companyId) {
      throw new NotFoundException();
    }
    return await this.reportsService.getGroupingTotal(
      { companyId, vehicleId },
      filter,
    );
  }
  @Get('company/:companyId/range')
  async getRange(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Req() req: Request,
    @Query() filter: FilterDto,
  ) {
    const { company_id } = req.user;
    if (company_id != companyId) {
      throw new NotFoundException();
    }
    return await this.reportsService.getListRange({ companyId }, filter);
  }
  @Get('company/:companyId/vehicle/:vehicleId/events')
  async getEvents(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Req() req: Request,
  ) {
    const { company_id } = req.user;
    if (company_id != companyId) {
      throw new NotFoundException();
    }
    return await this.reportsService.getListEvents({ companyId, vehicleId });
  }
}

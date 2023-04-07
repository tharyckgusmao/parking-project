import {
  Controller,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
} from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('api/v1/parking')
@ApiTags('Parking')
@ApiBearerAuth()
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Put('company/:companyId/vehicle/:vehicleId/input')
  async input(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Req() req: Request,
  ) {
    const { company_id } = req.user;
    if (company_id != companyId) {
      throw new NotFoundException();
    }
    return await this.parkingService.input({ companyId, vehicleId });
  }
  @Put('company/:companyId/vehicle/:vehicleId/output')
  async output(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Req() req: Request,
  ) {
    const { company_id } = req.user;

    if (company_id != companyId) {
      throw new NotFoundException();
    }
    return await this.parkingService.output({
      companyId: company_id,
      vehicleId,
    });
  }
}

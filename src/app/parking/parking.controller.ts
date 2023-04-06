import { Controller, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { ParkingService } from './parking.service';

@Controller('api/v1/parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Put('company/:companyId/vehicle/:vehicleId/input')
  async input(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  ) {
    return await this.parkingService.input({ companyId, vehicleId });
  }
  @Put('company/:companyId/vehicle/:vehicleId/output')
  async output(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  ) {
    return await this.parkingService.output({ companyId, vehicleId });
  }
}

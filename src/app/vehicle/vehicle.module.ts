import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { VehicleEntity } from './entity/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity])],
  exports: [VehicleModule],
  providers: [VehicleService],
  controllers: [VehicleController],
})
export class VehicleModule {}

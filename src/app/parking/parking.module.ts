import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationMiddleware } from 'src/shared/middlewares/authetication.middleware';
import { AuthModule } from '../auth/auth.module';
import { CompanyEntity } from '../company/entity/company.entity';
import { VehicleEntity } from '../vehicle/entity/vehicle.entity';
import { ParkingEntity } from './entity/parking.entity';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParkingEntity, VehicleEntity, CompanyEntity]),
    AuthModule,
  ],
  exports: [],
  providers: [ParkingService],
  controllers: [ParkingController],
})
export class ParkingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(ParkingController);
  }
}

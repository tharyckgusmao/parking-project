import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { AuthModule } from '../auth/auth.module';
import { ParkingEntity } from '../parking/entity/parking.entity';
import { VehicleEntity } from '../vehicle/entity/vehicle.entity';
import { CompanyEntity } from '../company/entity/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationMiddleware } from 'src/shared/middlewares/authetication.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParkingEntity, VehicleEntity, CompanyEntity]),
    AuthModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(ReportsController);
  }
}

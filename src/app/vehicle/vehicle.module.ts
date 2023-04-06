import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { VehicleEntity } from './entity/vehicle.entity';
import { AuthenticationMiddleware } from 'src/shared/middlewares/authetication.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity]), AuthModule],
  exports: [VehicleModule],
  providers: [VehicleService],
  controllers: [VehicleController],
})
export class VehicleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(VehicleController);
  }
}

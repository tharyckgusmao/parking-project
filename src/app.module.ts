import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './app/auth/auth.module';
import { CompanyModule } from './app/company/company.module';
import { ParkingModule } from './app/parking/parking.module';
import { UserModule } from './app/user/user.module';
import { VehicleModule } from './app/vehicle/vehicle.module';
import { validate } from './shared/config/validationEnv';
import { DatabaseModule } from './shared/database/database.module';
import { ReportsModule } from './app/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env', //or import from args
      isGlobal: true,
      validate: validate,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CompanyModule,
    VehicleModule,
    ParkingModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

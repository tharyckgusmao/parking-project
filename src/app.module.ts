import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './shared/config/validationEnv';
import { UserModule } from './app/user/user.module';
import { CompanyModule } from './app/company/company.module';
import { VehicleModule } from './app/vehicle/vehicle.module';

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
    CompanyModule,
    VehicleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

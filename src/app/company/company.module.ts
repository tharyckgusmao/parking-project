import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entity/company.entity';
import { ControlParking } from '../parking/entity/parking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity, ControlParking])],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}

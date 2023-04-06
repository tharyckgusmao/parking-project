import { ApiProperty } from '@nestjs/swagger';
import { ParkingEntity } from 'src/app/parking/entity/parking.entity';
import { UserEntity } from 'src/app/user/entity/user.entity';
import { VehicleEntity } from 'src/app/vehicle/entity/vehicle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'companies' })
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ length: 14 })
  @ApiProperty()
  cnpj: string;

  @Column({ length: 500 })
  @ApiProperty()
  address: string;

  @Column({ length: 11 })
  @ApiProperty()
  phone: string;

  @Column({ name: 'qty_vacancy_cars', type: 'int' })
  @ApiProperty()
  qtyVacancyCars: number;

  @Column({ name: 'qty_vacancy_motors', type: 'int' })
  @ApiProperty()
  qtyVacancyMotors: number;

  @OneToMany(() => UserEntity, (user) => user.id)
  @ApiProperty()
  user: UserEntity[];

  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.id)
  @ApiProperty()
  vehicle: UserEntity[];

  @OneToMany(() => ParkingEntity, (parking) => parking.id)
  @ApiProperty()
  parking: ParkingEntity[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @CreateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: string;
}

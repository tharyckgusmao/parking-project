import { VehicleEntity } from 'src/app/vehicle/entity/vehicle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'control_parking' })
export class ControlParking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CompanyEntity, (company) => company.id)
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.id)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: VehicleEntity;

  @Column({ type: 'tinyint', width: 2 })
  event: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}

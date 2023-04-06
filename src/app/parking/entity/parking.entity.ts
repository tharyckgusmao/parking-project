import { VehicleEntity } from 'src/app/vehicle/entity/vehicle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from '../../company/entity/company.entity';

@Entity({ name: 'parking' })
export class Parking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => CompanyEntity, (company) => company.id)
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @Column()
  company_id: string;

  @ManyToMany(() => VehicleEntity, (vehicle) => vehicle.id)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: VehicleEntity;

  @Column()
  vehicle_id: string;

  @Column({ type: 'tinyint', width: 2 })
  event: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}

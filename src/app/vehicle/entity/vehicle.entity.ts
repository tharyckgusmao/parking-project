import { CompanyEntity } from 'src/app/company/entity/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'vehicles' })
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column({ length: 7 })
  plate: string;

  @Column()
  type: string;

  @ManyToOne(() => CompanyEntity, (company) => company.id, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @Column()
  company_id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}

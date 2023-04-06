import {
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}

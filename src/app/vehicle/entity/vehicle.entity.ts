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

  @Column()
  plate: string;

  @Column()
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: string;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: string;
}

import { Parking } from 'src/app/parking/entity/parking.entity';
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
  name: string;

  @Column({ length: 14 })
  cnpj: string;

  @Column({ length: 500 })
  address: string;

  @Column({ length: 11 })
  phone: string;

  @Column({ name: 'qty_vacancy_cars', type: 'int' })
  qtyVacancyCars: number;

  @Column({ name: 'qty_vacancy_motors', type: 'int' })
  qtyVacancyMotors: number;

  @OneToMany(() => UserEntity, (user) => user.id)
  user: UserEntity[];

  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.id)
  vehicle: UserEntity[];

  @OneToMany(() => Parking, (control) => control.id)
  control: Parking[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}

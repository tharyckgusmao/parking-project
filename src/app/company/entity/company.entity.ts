import { UserEntity } from 'src/app/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ControlParking } from './controlParking.entity';

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

  @OneToMany(() => ControlParking, (control) => control.id)
  control: ControlParking[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}

import * as bcrypt from 'bcrypt';
import { MaxLength } from 'class-validator';
import { CompanyEntity } from 'src/app/company/entity/company.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CompanyEntity, (company) => company.id, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @Column()
  company_id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  @MaxLength(12)
  password: string;
  @BeforeInsert()
  @BeforeUpdate()
  async updatePassword(): Promise<void> {
    if (this.password.length < 13) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      this.password = hashedPassword;
    }
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}

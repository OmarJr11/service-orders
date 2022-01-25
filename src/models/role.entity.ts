import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';

@Index('roles_pkey', ['id'], { unique: true })
@Entity('roles', { schema: 'system' })
export class Role {
  @PrimaryGeneratedColumn({ type: 'int4', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', length: 50 })
  name: string;

  @Column('character varying', { name: 'status', length: 50 })
  status: string;

  @Column('int8', { name: 'creator', nullable: true, select: false })
  creator?: number;

  @Column('timestamp without time zone', {
    name: 'creation_date',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationDate?: Date;

  @Column('int8', { name: 'modifier', nullable: true, select: false })
  modifier?: number;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'modification_date',
    nullable: true,
    select: false,
  })
  modificationDate?: Date;

  @OneToMany(() => UserRole, (userRoles) => userRoles.role)
  userRoles?: UserRole[];
}

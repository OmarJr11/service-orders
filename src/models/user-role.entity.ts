import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

@Index('user_roles_pkey', ['id'], { unique: true })
@Entity('user_roles', { schema: 'system' })
export class UserRole {
  @PrimaryGeneratedColumn({ type: 'int4', name: 'id' })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user: User | number;

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

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn([{ name: 'role', referencedColumnName: 'id' }])
  role: Role;
}

import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'system' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int8', name: 'id' })
  id: number;

  @Column('character varying', { name: 'first_name', length: 50 })
  firstName: string;

  @Column('character varying', { name: 'last_name', length: 50 })
  lastName: string;

  @Column('character varying', { name: 'email', length: 100 })
  email: string;

  @Column('character varying', { name: 'status', length: 50 })
  status: string;

  @Column('character varying', { name: 'telephone', length: 50 })
  telephone?: string;

  @Column('character varying', { name: 'status', length: 20 })
  type: string;

  @Column('text', {
    array: true,
    name: 'services',
    select: true,
    nullable: true,
  })
  services?: string[];

  @Column('timestamp without time zone', {
    name: 'creation_date',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationDate?: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'modification_date',
    nullable: true,
    select: false,
  })
  modificationDate?: Date;
}

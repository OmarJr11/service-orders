import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from './service.entity';
import { User } from './user.entity';

@Index('tickets_pkey', ['id'], { unique: true })
@Entity('tickets', { schema: 'public' })
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'int8', name: 'id' })
  id: number;

  @ManyToOne(() => Service, (service) => service.id)
  @JoinColumn([{ name: 'service', referencedColumnName: 'id' }])
  service: number | Service;

  @Column('character varying', { name: 'token', length: 100, unique: true })
  token: string;

  @Column('character varying', { name: 'status', length: 50 })
  status: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn([{ name: 'creator', referencedColumnName: 'id' }])
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
}

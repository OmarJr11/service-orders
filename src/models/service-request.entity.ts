import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';

@Index('service_request_pkey', ['id'], { unique: true })
@Entity('service_request', { schema: 'public' })
export class ServiceRequest {
  @PrimaryGeneratedColumn({ type: 'int8', name: 'id' })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn([{ name: 'technical', referencedColumnName: 'id' }])
  technical: number | User;

  @ManyToOne(() => Ticket, (ticket) => ticket.id)
  @JoinColumn([{ name: 'ticket', referencedColumnName: 'id' }])
  ticket: number | Ticket;

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
}

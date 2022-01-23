import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { User } from './user.entity';

@Index('ticket_pkey', ['id'], { unique: true })
@Entity('ticket', { schema: 'public' })
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'int8', name: 'id' })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn([{ name: 'id_technical', referencedColumnName: 'id' }])
  idTechnical: number | User;

  @ManyToOne(() => ServiceRequest, (serviceRequest) => serviceRequest.id)
  @JoinColumn([{ name: 'id_request', referencedColumnName: 'id' }])
  idRequest: number | ServiceRequest;

  @Column('numeric', {
    name: 'price',
    precision: 18,
    scale: 4,
  })
  price: number;

  @Column('character varying', { name: 'status', length: 50 })
  status: string;

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

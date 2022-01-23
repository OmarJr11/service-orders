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

@Index('service_request_pkey', ['id'], { unique: true })
@Entity('service_request', { schema: 'public' })
export class ServiceRequest {
  @PrimaryGeneratedColumn({ type: 'int8', name: 'id' })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn([{ name: 'id_user', referencedColumnName: 'id' }])
  idUser: number | User;

  @ManyToOne(() => Service, (service) => service.id)
  @JoinColumn([{ name: 'id_service', referencedColumnName: 'id' }])
  idService: number | Service;

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

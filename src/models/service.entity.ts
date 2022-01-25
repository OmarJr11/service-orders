import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('service_pkey', ['id'], { unique: true })
@Entity('service', { schema: 'public' })
export class Service {
  @PrimaryGeneratedColumn({ type: 'int8', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', length: 50, unique: true })
  name: string;

  @Column('numeric', {
    name: 'price',
    precision: 18,
    scale: 4,
  })
  price: number;

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

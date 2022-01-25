import { Column, Entity, Index } from 'typeorm';

@Index('refresh_tokens_pkey', ['user', 'token'], { unique: true })
@Entity('refresh_tokens', { schema: 'system' })
export class RefreshToken {
  @Column('int8', { name: 'user', primary: true })
  user: number;

  @Column('character varying', { name: 'token', length: 400, primary: true })
  token: string;

  @Column('character varying', { name: 'refresh', length: 400 })
  refreshToken: string;

  @Column('timestamp without time zone', { name: 'expire' })
  expire: Date;
  
  @Column('timestamp without time zone', {
    name: 'creation_date',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationDate?: Date;
}

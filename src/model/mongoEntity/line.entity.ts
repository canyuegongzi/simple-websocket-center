import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ObjectIdColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class LineEntity {
  @ObjectIdColumn()
  id: string;

  @Column({ length: 500 })
  userId: string;

  @Column({ default: 0})
  status: number;

  @Column({ length: 500 })
  ip: string;

  @Column({ length: 500 })
  address: string;

  @Column({ length: 500 })
  wsId: string;

  @Column({ length: 500 })
  userName: string;
}

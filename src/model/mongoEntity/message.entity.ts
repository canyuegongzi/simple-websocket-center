import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ObjectIdColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Message {
  @ObjectIdColumn()
  id: string;

  @Column({ length: 500 })
  content: string;

  @Column({ length: 500 })
  type: string;

  @Column({ length: 500 })
  to: string;

  @Column({ length: 500 })
  from: string;

  @Column({ length: 500 })
  time: string;

  @Column({ length: 500 })
  user: string;

  @Column({ length: 500 })
  operate: string;

  @Column({ length: 500 })
  status: number;
}

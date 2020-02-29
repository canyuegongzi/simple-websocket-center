import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ObjectIdColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Type {
  @ObjectIdColumn()
  id: string;

  @Column({ default: 0})
  name: string;

  @Column({ default: 0})
  code: string;

  @Column({ default: 0})
  desc: string;
}

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import {Role} from './role.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({nullable: true})
  desc: string;

  @Column()
  parentId: number;

  @Column()
  parentName: string;

  @ManyToOne(type => User, user => user.id)
  leader: User;

  @ManyToMany(type => User, user => user.organizations)
  @JoinTable()
  users: User[];
}

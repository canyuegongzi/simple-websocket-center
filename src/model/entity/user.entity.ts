import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  desc: string;

  @Column({
    nullable: true, // 因为此属性后来才加，不设置nullable无法新增此属性
    length: 100,
    // 一般用repository.find不会出现此属性
    // 在QueryBuilder中select entity也不会出现
    select: false,
  })
  password: string;

  @Column( {select: false} )
  email: string;

  @Column({nullable: true})
  age: string;

  @Column({nullable: true})
  address: string;

  @Column({nullable: true})
  nick: string;

  @Column({default: 0})
  status: number;

  @ManyToOne(type => Role, role => role.users)
  role: Role;

  // @OneToMany(type => UserOrganization,  userOrganization => userOrganization.user)
  // userOrganization: UserOrganization[];

  @ManyToMany( type => Organization, orientation => orientation.users)
  organizations: Organization[];
}

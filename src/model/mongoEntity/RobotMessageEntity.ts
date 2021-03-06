import {Entity, Column, PrimaryGeneratedColumn, Double, ObjectIdColumn} from 'typeorm';

@Entity({name: 'robot_message'})
export class RobotMessageEntity {
  @ObjectIdColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  friendId: string;

  @Column()
  content: string;

  @Column()
  type: string;

  @Column('double')
  createTime: number;

  @Column()
  hashId: string;

  @Column({default: 0})
  status: number;
}

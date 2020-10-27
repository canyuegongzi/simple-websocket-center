import {Entity, Column, PrimaryGeneratedColumn, ObjectIdColumn, ObjectID} from 'typeorm';

@Entity()
export class UserMap {
  @ObjectIdColumn({ name: 'id' })
  id: ObjectID;

  @Column()
  friendId: number;

  @Column()
  friendName: string;

  @Column()
  friendIcon: string;

  @Column()
  userId: number;
}

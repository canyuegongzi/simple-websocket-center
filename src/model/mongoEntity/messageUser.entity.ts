import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ObjectIdColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class MessageUserEntity {
    @ObjectIdColumn()
    id: string;

    @Column({ length: 500 })
    userId: string;

    @Column({ default: 0})
    status: number;

    @Column({ length: 500 })
    userName: string;

    @Column({ length: 1000 })
    friends: string;

    @Column({ length: 1000 })
    groups: string;

    @Column({ length: 1000 })
    createTime: number;

}

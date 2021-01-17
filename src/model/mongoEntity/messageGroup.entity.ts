import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ObjectIdColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class MessageGroupEntity {
    @ObjectIdColumn()
    id: string;

    @Column({ length: 500 })
    userId: string;

    @Column({ default: 0})
    status: number;

    @Column({ length: 500 })
    name: string;

    @Column({ length: 1000 })
    address: string;

    @Column({ length: 1000 })
    person: string;

    @Column({ length: 50 })
    icon: string;

    @Column({ length: 1000 })
    createTime: number;

}

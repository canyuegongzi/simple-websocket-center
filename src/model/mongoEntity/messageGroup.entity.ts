import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ObjectIdColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class MessageGroup {
    @ObjectIdColumn()
    id: string;

    @Column({ length: 500 })
    userId: number;

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

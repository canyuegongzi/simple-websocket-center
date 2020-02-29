import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ObjectIdColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class RequestMessage {
    @ObjectIdColumn()
    id: string;

    @Column({ length: 500 })
    fromId: string;

    @Column({ length: 500 })
    toId: string;

    // 负责人
    @Column({ length: 500 })
    accept: string;

    // 备注
    @Column({ length: 500 })
    rank: string;

    // 1 : 默认friend    2: group
    @Column({ default: 1})
    type: number;

    // 0 未读  1 同意  2 拒绝
    @Column({ default: 0})
    status: number;

    @Column({ length: 100 })
    createTime: number;

    @Column({ length: 100 })
    dealTime: number

}

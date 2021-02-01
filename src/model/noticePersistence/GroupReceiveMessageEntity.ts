import {Entity, Column, PrimaryGeneratedColumn, Double, ObjectIdColumn} from 'typeorm';

@Entity({name: 'group_receive_message'})
export class GroupReceiveMessageEntity {
    @ObjectIdColumn()
    id: number;

    @Column({comment: '消息标识'})
    hashId: string;

    @Column({default: 0})
    status: number;

    @Column({comment: '消息内容'})
    content: string;

    @Column({comment: '消息类型'})
    messageType: string;

    @Column({comment: '群组id'})
    groupId: string;

    @Column({comment: '用户id'})
    userId: string;

    @Column({comment: '更新时间'})
    updateTime: number;

    @Column({comment: '创建时间', default: new Date().getTime()})
    createTime: number;

    @Column({comment: '删除时间'})
    deleteTime: number;
}

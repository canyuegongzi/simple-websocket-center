import {Entity, Column, PrimaryGeneratedColumn, ObjectIdColumn, ObjectID} from 'typeorm';

@Entity({name: 'im_request_group'})
export class ImRequestGroupEntity {
    @ObjectIdColumn({ name: 'id' })
    id: ObjectID;

    @Column({comment: '请求来源id'})
    userId: string;

    @Column({comment: '请求来源name'})
    userName: string;

    @Column({comment: '目标个人id'})
    targetId: string;

    @Column({comment: '目标个人name'})
    targetName: string;

    @Column({comment: '群组id'})
    groupId: string;

    @Column({comment: '群组name'})
    groupName: string;

    @Column({comment: '备注'})
    note: string;

    @Column({comment: '状态', default: false})
    state: boolean;

    @Column({comment: '处置状态', default: 1})
    callBackType: number; // 1 未应答 2： 同意  3： 不同意

    @Column({comment: '请求session标识'})
    sessionId: string;

    @Column({comment: '更新时间'})
    updateTime: number;

    @Column({comment: '创建时间', default: new Date().getTime()})
    createTime: number;

    @Column({comment: '删除时间'})
    deleteTime: number;

}

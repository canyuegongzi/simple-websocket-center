import {Entity, Column, PrimaryGeneratedColumn, ObjectIdColumn, ObjectID} from 'typeorm';

@Entity({name: 'im_group'})
export class GroupEntity {
    @ObjectIdColumn({ name: 'id'})
    id: ObjectID;

    @Column({ name: 'groupCode'})
    groupCode: string;

    @Column({comment: '群主'})
    rootId: string;

    @Column({comment: '群主名'})
    rootName: string;

    @Column({comment: '群图片'})
    groupIcon: string;

    @Column({comment: '群描述'})
    groupDesc: string;

    @Column({comment: '群名称'})
    groupName: string;

    @Column({comment: '更新时间'})
    updateTime: number;

    @Column({comment: '创建时间', default: new Date().getTime()})
    createTime: number;

    @Column({comment: '删除时间'})
    deleteTime: number;
}

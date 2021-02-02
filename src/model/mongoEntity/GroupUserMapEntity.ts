import {Entity, Column, PrimaryGeneratedColumn, ObjectIdColumn, ObjectID} from 'typeorm';

@Entity({name: 'im_group_user_map'})
export class GroupUserMapEntity {
    @ObjectIdColumn({ name: 'id' })
    id: ObjectID;

    @Column({comment: '群code'})
    groupCode: string;

    @Column({comment: '群员id'})
    userId: string;

    @Column({comment: '群员name'})
    userName: string;

    @Column({comment: '个人头像'})
    userIcon: string;

    @Column({comment: '群人员角色id'})
    userRoleId: string;

    @Column({comment: '群人员角色'})
    userRoleName: string;

    @Column({comment: '更新时间'})
    updateTime: number;

    @Column({comment: '创建时间', default: new Date().getTime()})
    createTime: number;

    @Column({comment: '删除时间'})
    deleteTime: number;
}

import {Entity, Column, PrimaryGeneratedColumn, ObjectIdColumn, ObjectID} from 'typeorm';

@Entity({name: 'im_group_user_role'})
export class GroupUserRoleEntity {
    @ObjectIdColumn({ name: 'id' })
    id: ObjectID;

    @Column({comment: '角色name'})
    roleName: string;

    @Column({comment: '角色描述'})
    roleDesc: string;

    @Column({comment: '更新时间'})
    updateTime: number;

    @Column({comment: '创建时间', default: new Date().getTime()})
    createTime: number;

    @Column({comment: '删除时间'})
    deleteTime: number;

}

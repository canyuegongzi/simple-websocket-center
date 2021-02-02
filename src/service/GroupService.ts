import {HttpService, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Column, MongoRepository, ObjectIdColumn} from 'typeorm';
import {GroupEntity} from '../model/mongoEntity/GroupEntity';
import {GroupUserMapEntity} from '../model/mongoEntity/GroupUserMapEntity';
import {GroupUserRoleEntity} from '../model/mongoEntity/GroupUserRoleEntity';
import {ImRequestGroupEntity} from '../model/mongoEntity/ImRequestGroupEntity';
import {RequestAddGroupDto} from '../model/DTO/group/RequestAddGroup.dto';
import {RequestUpdateGroupDto} from '../model/DTO/group/RequestUpdateGroup.dto';
import {RequestAddUserToGroupDto} from '../model/DTO/group/RequestAddUserToGroup.dto';
import {RequestGroupCallBackDto} from '../model/DTO/group/RequestGroupCallBack.dto';
import { ObjectID } from 'mongodb';
import {ApiException} from '../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../config/ApiErrorCodeEnum';
import {AmqpConnection} from '@golevelup/nestjs-rabbitmq';
import * as uuid from 'uuid';
import {rabbitMQConfig} from '../config/config';
import {GroupQueryDto} from '../model/DTO/group/GroupQueryDto';
import {FriendMessageEntity} from '../model/noticePersistence/FriendMessageEntity';

declare const enum GROUP_ROLE_MAP {
    ROOT =  'ROOT',
    ADMIN = 'ADMIN',
    NORMAL = 'NORMAL',
}
@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(GroupEntity) private readonly groupEntityRepository: MongoRepository<GroupEntity>,
        @InjectRepository(GroupUserMapEntity) private readonly groupUserMapEntityRepository: MongoRepository<GroupUserMapEntity>,
        @InjectRepository(GroupUserRoleEntity) private readonly groupUserRoleEntityRepository: MongoRepository<GroupUserRoleEntity>,
        @InjectRepository(ImRequestGroupEntity) private readonly imRequestGroupEntityRepository: MongoRepository<ImRequestGroupEntity>,
        private readonly httpService: HttpService,
        private readonly messageClient: AmqpConnection,
    ) {}

    /**
     * 获取用户的群组
     * @param userId
     */
    public async getList(userId: string) {
        try {
            const res: [GroupUserMapEntity[], number] = await this.groupUserMapEntityRepository.findAndCount({userId});
            const codes = res[0].map((item: GroupUserMapEntity) => {
                return item.groupCode;
            });
            return await this.groupEntityRepository.find({
                where: {
                    groupCode: {
                        $in: codes,
                    },
                },
            });
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 创建群组
     * @param params
     */
    public async createGroup(params: RequestAddGroupDto) {
        try {
            const documentDoc: RequestAddGroupDto = {
                ...params,
                updateTime: null,
                groupCode: uuid.v1(), // 给每个群加个标识
                deleteTime: null,
                createTime: new Date().getTime(),
                groupDesc: params.groupDesc || '',
                groupIcon: params.groupIcon || 'http://qiniu.canyuegongzi.xyz/person_timg.jpg',
            };
            const res: any = await this.groupEntityRepository.insertOne(documentDoc);
            // @ts-ignore
            const groupUserDocumentDoc: GroupUserMapEntity = {
                groupCode: documentDoc.groupCode,
                userId: params.rootId,
                userName: params.rootName,
                userIcon: params.rootIcon || null,
                userRoleId: GROUP_ROLE_MAP.ROOT,
                userRoleName: GROUP_ROLE_MAP.ROOT,
                updateTime: null,
                createTime: new Date().getTime(),
                deleteTime: null,
            };
            return await this.groupUserMapEntityRepository.insertOne(groupUserDocumentDoc);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 更新群组
     * @param params
     */
    public async updateGroup(params: RequestUpdateGroupDto) {
        // TODO  需要处理同步群信息
        try {
            if (params.id) {
                delete params.id;
            }
            await this.groupEntityRepository.updateOne({
                _id: new ObjectID(params.id),
            },  { $set: {
                    ...params, updateTime: new Date().getTime(),
                } });
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 删除群组
     * @param groupCode
     */
    public async deleteGroup(groupCode: string) {
        try {
            await this.groupEntityRepository.deleteOne({ groupCode});
            return  await this.groupUserMapEntityRepository.deleteMany({groupCode});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查询群组信息
     * @param groupCode
     */
    public async getGroupInfo(groupCode: string) {
        try {
            const userList: GroupUserMapEntity[] = await this.groupUserMapEntityRepository.find({
                groupCode,
            });
            const groupList: GroupEntity[] = await this.groupEntityRepository.find({groupCode});
            return  groupList.map((item: GroupEntity) => {
                return {
                    ...item,
                    groupCode,
                    userList: userList.map((user: GroupUserMapEntity) => {
                        return {
                            userId: user.userId,
                            userName: user.userName,
                            userRoleName: user.userRoleName,
                            createTime: user.createTime,
                        };
                    }),
                };
            });
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 添加好友到群組申請
     * @param params
     */
    public async requestAddFriendToGroup(params: RequestAddUserToGroupDto) {
        try {
            const uuidStr: string = uuid.v1();
            const requestAddUserToGroupDtoList: RequestAddUserToGroupDto[] = [];
            const groupCode: string = params.groupCode;
            if (!groupCode) {
                const groupInfo: GroupEntity = await this.groupEntityRepository.findOne({ groupCode: params.groupCode});
                console.log(groupInfo);
            }
            return;
            // 查询出群组的管理人员（群主 | 管理员）
            const list: any = await this.queryUserListOfGroup([GROUP_ROLE_MAP.ROOT, GROUP_ROLE_MAP.ADMIN], params.groupCode || params.groupCode);
            const userList: GroupUserMapEntity[] = list;
            const userIds = userList.map((item: GroupUserMapEntity) => item.userId);
            for (let i = 0; i < userList.length; i ++) {
                const documentData: ImRequestGroupEntity = { ...params, note: params.note || null, targetId: userList[i].userId, targetName: userList[i].userName, callBackType: 1, state: false, sessionId: uuidStr, createTime: new Date().getTime() };
                requestAddUserToGroupDtoList.push(documentData);
            }
            if (requestAddUserToGroupDtoList.length) {
                // 把入群请求扔到消息队列里面
                const publishData = {groupCode: params.groupCode, groupName: params.groupName, targetId: userIds.join(','), formId: params.userId, type: 'GROUP', note: params.note};
                await this.messageClient.publish(rabbitMQConfig.websocketRequestExchange, 'new-request', JSON.stringify(publishData));
                // 把请求数据持久化掉
                return await this.imRequestGroupEntityRepository.insertMany(requestAddUserToGroupDtoList);
            }
        } catch (e) {
            console.log(e);
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 入群同意操作
     * @param params
     */
    public async callbackRequest(params: RequestGroupCallBackDto) {
        const updateData = async () => {
            await this.imRequestGroupEntityRepository.updateMany({
                sessionId: params.sessionId,
            },  { $set: {callBackType: params.callBackType, state: true, updateTime: new Date().getTime()} });
        };
        try {
            const userFriendInfo: ImRequestGroupEntity[] = await this.imRequestGroupEntityRepository.find({
                sessionId: params.sessionId,
            });
            const currentList = userFriendInfo.filter((item) => item.state === true);
            if (currentList.length > 0) {
                await updateData();
                return;
            }
            await updateData();
            if (!userFriendInfo || userFriendInfo.length > 0) {
                const itemInfo: any = userFriendInfo[0];
                // 将用户加入群人员
                const friendList: GroupUserMapEntity[] = [
                    // @ts-ignore
                    {groupCode: itemInfo.groupCode, userId: itemInfo.userId, userName: itemInfo.userName, userIcon: itemInfo.userIcon || null, userRoleId: GROUP_ROLE_MAP.NORMAL, userRoleName: GROUP_ROLE_MAP.NORMAL, updateTime: null, createTime: new Date().getTime(), deleteTime: null}
                    ];
                await this.groupUserMapEntityRepository.insertMany(friendList);
            }
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查询群组的人员
     * @param role
     * @param groupCode
     * @return [GroupUserMapEntity[], number]
     */
    public async queryUserListOfGroup(role: string[] = [], groupCode: string) {
        let roleList: string[] = role;
        if (!roleList.length) {
            roleList = [GROUP_ROLE_MAP.ROOT, GROUP_ROLE_MAP.ADMIN, GROUP_ROLE_MAP.NORMAL];
        }
        try {
            const userList: GroupUserMapEntity[] = await this.groupUserMapEntityRepository.find(
                {
                    order: { userName: 'DESC'},
                    where: {
                        userRoleId: {
                            $in: roleList,
                        },
                        groupCode,
                    },
                });
            return userList;
        } catch (e) {
            return [];
        }
    }

    /**
     * 搜索群组
     * @param params
     */
    public async getQueryList(params: GroupQueryDto) {
        try {
            const pageSize = Number(params.pageSize);
            const page = Number(params.page);
            const groupList = await this.groupEntityRepository.find({
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {
                    groupName: {
                        $regex: params.groupName,
                    },
                },
            });
            return groupList;
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }
}

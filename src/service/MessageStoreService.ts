import { HttpService, Injectable } from '@nestjs/common';
import {MongoRepository, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {FriendMessageEntity} from '../model/noticePersistence/FriendMessageEntity';
import {GetMessageQueryDto} from '../model/DTO/messageStore/GetMessageQueryDto';
import {ApiException} from '../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../config/ApiErrorCodeEnum';
import {UserMessageQueryDto} from '../model/DTO/messageStore/UserMessageQueryDto';
import {AffirmChatMessageDto} from '../model/DTO/messageStore/AffirmChatMessageDto';
import {From, On} from 'nest-event';
import {FriendMessageOffLineEntity} from '../model/noticePersistence/FriendMessageOffLineEntity';
import {GroupReceiveMessageEntity} from '../model/noticePersistence/GroupReceiveMessageEntity';
import {GroupSendMessageEntity} from '../model/noticePersistence/GroupSendMessageEntity';
import {GroupMessageQueryDto} from '../model/DTO/messageStore/GroupMessageQueryDto';
import {GroupUserMapEntity} from '../model/mongoEntity/GroupUserMapEntity';
import {UserMap} from '../model/mongoEntity/FriendEntity';

@Injectable()
export class MessageStoreService {
    constructor(
        @InjectRepository(FriendMessageEntity, 'noticePersistence') private readonly friendMessageEntityRepository: MongoRepository<FriendMessageEntity>,
        @InjectRepository(FriendMessageOffLineEntity, 'noticePersistence') private readonly friendMessageOffLineEntityRepository: MongoRepository<FriendMessageOffLineEntity>,
        @InjectRepository(GroupReceiveMessageEntity, 'noticePersistence') private readonly groupReceiveMessageEntityRepository: MongoRepository<GroupReceiveMessageEntity>,
        @InjectRepository(GroupSendMessageEntity, 'noticePersistence') private readonly groupSendMessageEntityRepository: MongoRepository<GroupSendMessageEntity>,
        @InjectRepository(GroupUserMapEntity) private readonly groupUserMapEntityRepository: MongoRepository<GroupUserMapEntity>,
        @InjectRepository(UserMap) private readonly userMapRepository: MongoRepository<UserMap>,
    ) {}

    /**
     * 查询用户首页消息列表(好友消息列表)
     */
    public async getUserFriendHomeMessageList(messageQueryDto: GetMessageQueryDto) {
        let userFriendIds: string[] = messageQueryDto.friendList;
        const pageSize = Number(messageQueryDto.pageSize);
        const page = Number(messageQueryDto.page);
        try {
            if (!userFriendIds || !userFriendIds.length) {
                try {
                    const res = await this.userMapRepository.findAndCount({userId: messageQueryDto.userId.toString()});
                    userFriendIds = res[0].map((item) => {
                        return item.friendId + '';
                    });
                } catch (e) {
                    userFriendIds = [];
                }

            }
            const userId: string = messageQueryDto.userId + '';
            const timeNumber: number = Number(messageQueryDto.time);
            const friendList: string[] = [userId];
            const messageRes: [FriendMessageEntity[], number] = await this.friendMessageEntityRepository.findAndCount(
                {skip: (page - 1) * pageSize,
                    take: pageSize,
                    order: { createTime: 'DESC'},
                    where: {
                        createTime: {
                                $gt: timeNumber,
                            },
                        $or: [
                            {
                                userId: {
                                    $in: friendList,
                                },
                                friendId: {
                                    $in: userFriendIds,
                                },
                            },
                            {
                                userId: {
                                    $in: userFriendIds,
                                },
                                friendId: {
                                    $in: friendList,
                                },
                            },
                        ],
                    },
                });
            const friendMessageMap = await this.getFriendMessageGroupList(messageRes[0], userFriendIds, friendList,  messageQueryDto.userId);
            return friendMessageMap;
        } catch (e) {
            console.log(e);
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 首页群消息统计
     * @param messageQueryDto
     */
    public async getUserGroupHomeMessageList(messageQueryDto: GetMessageQueryDto) {
        let userGroupCodes: string[] = messageQueryDto.groupList;
        const pageSize = Number(messageQueryDto.pageSize);
        const page = Number(messageQueryDto.page);
        try {
            if (!userGroupCodes || !userGroupCodes.length) {
                try {
                    const res = await this.groupUserMapEntityRepository.findAndCount({userId: messageQueryDto.userId.toString()});
                    userGroupCodes = res[0].map((item) => {
                        return item.groupCode;
                    });
                } catch (e) {
                    userGroupCodes = [];
                }

            }
            const timeNumber: number = Number(messageQueryDto.time);
            const messageRes: [GroupReceiveMessageEntity[], number] = await this.groupReceiveMessageEntityRepository.findAndCount(
                {skip: (page - 1) * pageSize,
                    take: pageSize,
                    order: { createTime: 'DESC'},
                    where: {
                        createTime: {
                            $gt: timeNumber,
                        },
                        groupCode: {
                            $in: userGroupCodes,
                        },
                        userId: messageQueryDto.userId,
                    },
                });
            return this.getGroupMessageGroupList(messageRes[0], userGroupCodes, messageQueryDto.userId);
        } catch (e) {
            console.log(e);
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 对首页消息进行分页(好友)
     * @param messageList
     * @param friendList
     */
    public async getFriendMessageGroupList(messageList: FriendMessageEntity[], friendList: any[], userList: any[], userId: string) {
        const friendMessageMap = {};
        for (let i: number = 0; i < friendList.length; i ++) {
            const includeUserIds: any[] = [friendList[i]].concat(userList);
            const messageArr: FriendMessageEntity[] = messageList.filter((item: FriendMessageEntity) => {
                return includeUserIds.includes(item.friendId) && includeUserIds.includes(item.userId);
            });
            const unreadHashIds = [];
            const unreadMessageArr = messageArr.filter((item1: FriendMessageEntity) => {
                if (item1.status + '' === '0' && item1.friendId + '' === userId + '') {
                    unreadHashIds.push(item1.hashId);
                }
                return item1.status + '' === '0' && item1.friendId + '' === userId + '';
            });
            if (messageArr.length) {
                friendMessageMap[friendList[i]] = [{...messageArr[0], messageType: 'FRIEND', messageTotal: messageArr.length, unreadMessageTotal: unreadMessageArr.length, unreadHashIds}];
            }
        }
        return {friendData: friendMessageMap, total: messageList.length, friendList};
    }

    /**
     * 对首页群组信息分类计算
     * @param messageList
     * @param friendList
     */
    public async getGroupMessageGroupList(messageList: GroupReceiveMessageEntity[], groupList: any[], userId: string) {
        try {
            const messageMap: any = {};
            const messageTotalMap: any = {};
            const messageUnreadHashIdsMap: any = {};
            for (let i = 0; i < messageList.length; i ++) {
                if (!messageMap[messageList[i].groupCode]) { messageMap[messageList[i].groupCode] = []; }
                if (!messageTotalMap[messageList[i].groupCode]) { messageTotalMap[messageList[i].groupCode] = 0; }
                messageMap[messageList[i].groupCode].push(messageList[i]);
                if (messageList[i].status + '' === '0') {
                    messageTotalMap[messageList[i].groupCode] = messageTotalMap[messageList[i].groupCode] + 1;
                    if (!messageUnreadHashIdsMap[messageList[i].groupCode])  {
                        messageUnreadHashIdsMap[messageList[i].groupCode] = [];
                    }
                    messageUnreadHashIdsMap[messageList[i].groupCode].push(messageList[i].hashId);
                }
            }
            const resultMap: any = {};
            for (const key in messageMap) {
                if (messageMap[key].length) {
                    resultMap[key] = [{...messageMap[key][0], messageType: 'GROUP', messageTotal: null, unreadMessageTotal: messageTotalMap[key], unreadHashIds: messageUnreadHashIdsMap[key] || []}];
                }
            }
            return {groupData: resultMap, groupList};
        } catch (e) {
            console.log(e);
        }

    }

    /**
     * 查询俩用户的聊天记录
     * @param messageQueryDto
     */
    public async getMessageByUserIds(messageQueryDto: UserMessageQueryDto) {
        const pageSize = Number(messageQueryDto.pageSize);
        const page = Number(messageQueryDto.page);
        try {
            const messageRes: [FriendMessageEntity[], number] = await this.friendMessageEntityRepository.findAndCount(
                {skip: (page - 1) * pageSize,
                    take: pageSize,
                    order: { createTime: 'DESC'},
                    where: {
                        $or: [
                            {
                                friendId: messageQueryDto.friendId + '',
                                userId: messageQueryDto.userId + '',
                            },
                            {
                                friendId: messageQueryDto.userId + '',
                                userId: messageQueryDto.friendId + '',
                            },
                        ],
                    },
                });
            return messageRes;
        } catch (e) {
            console.log(e);
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查询群组的聊天记录
     * @param messageQueryDto
     */
    public async getGroupMessageList(messageQueryDto: GroupMessageQueryDto) {
        const pageSize = Number(messageQueryDto.pageSize);
        const page = Number(messageQueryDto.page);
        try {
            const messageRes: [GroupReceiveMessageEntity[], number] = await this.groupReceiveMessageEntityRepository.findAndCount(
                {skip: (page - 1) * pageSize,
                    take: pageSize,
                    order: { createTime: 'DESC'},
                    where: {
                        groupCode: messageQueryDto.groupCode,
                    },
                    select: ['content', 'createTime', 'hashId', 'messageType', 'userId', 'hashId', 'id'],
                });
            return messageRes;
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 好友消息状态确认
     */
    @From('emit-websocket-message')
    @On('affirm-message')
    public async changeMessageStatus(message: AffirmChatMessageDto) {
        switch (message.messageType) {
            case 'FRIEND':
                return this.updateFriendMessageStatus(message);
            case 'GROUP':
                return this.updateGroupMessageStatus(message);
            default:
                return;
        }
    }

    /**
     * 更新好友消息状态
     * @param message
     */
    public async updateFriendMessageStatus(message: AffirmChatMessageDto) {
        const hashIds: string[] = message.hashId.split(',');
        try {
            return await Promise.all([
                this.friendMessageOffLineEntityRepository.deleteMany({hashId: {$in: hashIds}}),
                this.friendMessageEntityRepository.updateMany(
                    {
                        hashId: {
                            $in: hashIds,
                        },
                    },
                    {
                        $set: {
                            status: message.status,
                        },
                    }),
            ]);
        } catch (e) {
            console.error(e);

        }
    }

    /**
     * 更新群组消息状态
     * @param message
     */
    public async updateGroupMessageStatus(message: AffirmChatMessageDto) {
        const hashIds: string[] = message.hashId.split(',');
        console.log(message.groupCode);
        console.log(message.userId);
        return await Promise.all([
            this.groupReceiveMessageEntityRepository.updateMany(
                {
                    hashId: {
                        $in: hashIds,
                    },
                    userId: message.userId,
                    groupCode: message.groupCode,
                },
                {
                    $set: {
                        status: message.status,
                    },
                }),
        ]);
    }
}

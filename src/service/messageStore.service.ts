import { HttpService, Injectable } from '@nestjs/common';
import {MongoRepository, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {FriendMessageEntity} from '../model/noticePersistence/friendMessage.entity';
import {GetMessageQueryDto} from '../model/DTO/messageStore/GetMessageQueryDto';
import {ApiException} from '../common/error/exceptions/api.exception';
import {ApiErrorCode} from '../config/api-error-code.enum';
import {FriendService} from './friend.service';
import {UserMessageQueryDto} from '../model/DTO/messageStore/UserMessageQueryDto';
import {AffirmChatMessageDto} from '../model/DTO/messageStore/AffirmChatMessageDto';
import {From, On} from 'nest-event';
import {FriendMessageOffLineEntity} from '../model/noticePersistence/friendMessageOffLine.entity';

@Injectable()
export class MessageStoreService {
    constructor(
        @InjectRepository(FriendMessageEntity, 'noticePersistence') private readonly friendMessageEntityRepository: MongoRepository<FriendMessageEntity>,
        @InjectRepository(FriendMessageOffLineEntity, 'noticePersistence') private readonly friendMessageOffLineEntityRepository: MongoRepository<FriendMessageOffLineEntity>,
        private readonly httpService: HttpService,
        private readonly friendService: FriendService,
    ) {}

    /**
     * 查询用户首页消息列表(好友消息列表)
     */
    public async getUserHomeMessageList(messageQueryDto: GetMessageQueryDto) {
        let userFriendIds: string[] = messageQueryDto.friendList;
        const pageSize = Number(messageQueryDto.pageSize);
        const page = Number(messageQueryDto.page);
        try {
            if (!userFriendIds || !userFriendIds.length) {
                try {
                    const res = await this.friendService.getFriends(messageQueryDto.userId);
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
     * 对首页消息进行分页
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
                friendMessageMap[friendList[i]] = [{...messageArr[0], messageTotal: messageArr.length, unreadMessageTotal: unreadMessageArr.length, unreadHashIds}];
            }
        }
        return {data: friendMessageMap, total: messageList.length, friendList};
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
     * 好友消息状态确认
     */
    @From('emit-websocket-message')
    @On('affirm-message')
    public async changeFriendMessageStatus(message: AffirmChatMessageDto) {
        console.log('开始修改信息状态');
        const hashIds: string[] = message.hashId.split(',');
        try {
            await this.friendMessageOffLineEntityRepository.deleteMany( {hashId: {$in: hashIds}});
            await this.friendMessageEntityRepository.updateMany(
                {
                    hashId: {
                        $in: hashIds,
                    },
                        },
                {
                        $set: {
                            status: message.status,
                        },
            });
        } catch (e) {
            console.error(e);

        }
    }
}

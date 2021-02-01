import {HttpService, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {MongoRepository} from 'typeorm';
import {RobotMessageEntity} from '../model/mongoEntity/RobotMessageEntity';
import {Emitter, From, NestEventEmitter, On} from 'nest-event';
import {GetMessageQueryDto} from '../model/DTO/messageStore/GetMessageQueryDto';
import {FriendMessageEntity} from '../model/noticePersistence/FriendMessageEntity';
import { UserMessageQueryDto } from 'src/model/DTO/messageStore/UserMessageQueryDto';
import {ApiException} from '../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../config/ApiErrorCodeEnum';

@Injectable()
export class SystemRobotMessageStoreService {
    constructor(
        @InjectRepository(RobotMessageEntity) private readonly robotMessageMapRepository: MongoRepository<RobotMessageEntity>,
        private readonly httpService: HttpService,
    ) {}

    /**
     * 订阅消息
     */
    @From('emit-robot-message')
    @On('insert-robot-message')
    public async insertMessageDocs(messageList: RobotMessageEntity[]) {
        // 存储机器人聊天信息
        return this.robotMessageMapRepository.insertMany(messageList);
    }

    /**
     * 查询用户首页消息列表(好友消息列表)
     */
    public async getUserHomeMessageList(messageQueryDto: GetMessageQueryDto) {
        const userFriendIds: string[] = messageQueryDto.friendList;
        const pageSize = Number(messageQueryDto.pageSize);
        const page = Number(messageQueryDto.page);
    }

    /**
     * 对首页消息进行分页
     * @param messageList
     * @param friendList
     */
    public async getFriendMessageGroupList(messageList: FriendMessageEntity[], friendList: any[], userList: any[]) {
        const friendMessageMap = {};
        for (let i: number = 0; i < friendList.length; i ++) {
            const includeUserIds: any[] = [friendList[i]].concat(userList);
            const messageArr: FriendMessageEntity[] = messageList.filter((item: FriendMessageEntity) => {
                return includeUserIds.includes(item.friendId) && includeUserIds.includes(item.userId);
            });
            if (messageArr.length) {
                friendMessageMap[friendList[i]] = [messageArr[0]];
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
            const messageRes: [FriendMessageEntity[], number] = await this.robotMessageMapRepository.findAndCount(
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

}

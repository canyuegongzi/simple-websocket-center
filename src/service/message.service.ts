import { HttpService, Injectable } from '@nestjs/common';
import { CreatLineDto } from '../model/DTO/line/create_line.dto';
import { httpUrl } from '../config/config';
import {ApiErrorCode} from '../config/api-error-code.enum';
import {UpdateLineDto} from '../model/DTO/line/update_line.dto';
import {QueryMessageDto} from '../model/DTO/message/queryMessageDto';
import {CreatMessageDto} from '../model/DTO/message/create_message.dto';
import {MessageUserDto} from '../model/DTO/message/message_user.dto';
import {QueryMessageUserDto} from '../model/DTO/message/query_message_user.dto';
import {QueryUserList} from '../model/DTO/message/query_user_list.dto';
import {QueryUserMessageListDto} from '../model/DTO/message/query_user_message_list.dto';
import {MongoRepository, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {MessageGroupEntity} from '../model/mongoEntity/messageGroup.entity';
import {TypeEntity} from '../model/mongoEntity/type.entity';
import {MessageEntity} from '../model/mongoEntity/message.entity';
import {MessageUserEntity} from '../model/mongoEntity/messageUser.entity';
import {LineEntity} from '../model/mongoEntity/line.entity';
import {ApiException} from '../common/error/exceptions/api.exception';
import {QueryMyMessageListDto} from '../model/DTO/message/queryMyMessageList.dto';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageGroupEntity) private readonly messageGroupRepository: Repository<MessageGroupEntity>,
        @InjectRepository(TypeEntity) private readonly mongoTypeRepository: MongoRepository<TypeEntity>,
        @InjectRepository(MessageEntity) private readonly mongoMessageRepository: MongoRepository<MessageEntity>,
        @InjectRepository(MessageUserEntity) private readonly mongoMessageUserRepository: MongoRepository<MessageUserEntity>,
        @InjectRepository(LineEntity) private readonly mongoLineRepository: MongoRepository<LineEntity>,
        private readonly httpService: HttpService,
    ) {}

    /**
     * 用户上线
     */
    async userOnline(line: CreatLineDto, wsId: string) {
        const currentUser = await this.httpService
            .get(`${httpUrl.userApi}/user/getUserInfo?id=${line.userId}`)
            .toPromise();
        const obj = new CreatLineDto();
        obj.userId = line.userId;
        obj.wsId = wsId;
        obj.address = line.address || '';
        obj.status = 1;
        obj.userName = currentUser.data.data.data.name;
        obj.ip = line.ip || '';
        try {
            return await this.mongoLineRepository.updateOne( { userId: obj.userId }, { $set: obj }, { upsert: true });
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 用户下线
     */
    async userOutLine(line: UpdateLineDto) {
        const where = { userId: line.userId };
        try {
            return await this.mongoLineRepository.updateOne( { userId: line.userId }, { $set: { status: 0, wsId: '' } }, { upsert: true });
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查询用户状态
     * @param userId
     */
    async findUserStatus(userId: string) {
        try {
            return await this.mongoLineRepository.find({userId});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 移除状态
     * @param userId
     */
    async deleteUser(userIds: Array<string | number>) {
        return this.mongoLineRepository.deleteMany(userIds);
    }

    /**
     * 查询用户列表（全部）
     */
    async getUserList() {
        try {
            const res = await this.mongoLineRepository.find();
            return { success: true, data: res, message: '查询成功' };
        } catch (e) {
            return { success: true, data: [], message: '查询失败' };
        }
    }

    /**
     * 查询群组列表（全部）
     */
    async getGroupList() {
        try {
            const res = await this.mongoLineRepository.find();
            return { success: true, data: res, message: '查询成功' };
        } catch (e) {
            return { success: true, data: [], message: '查询失败' };
        }
    }

    /**
     * 查询用户的消息列表
     */
    async getUserMessageList(query: QueryMessageDto) {
        try {
            const res = await this.mongoMessageRepository.find({to: query.to});
            return { success: true, data: res, message: '查询成功' };
        } catch (e) {
            return { success: true, data: [], message: '查询失败' };
        }
    }
    /**
     * 查询用户状态
     */
    async getUser(userId: string) {
        try {
            return await this.mongoLineRepository.find({userId});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 保存消息
     * @param message
     */
    async saveMessage(message: CreatMessageDto) {
        const obj = new MessageEntity();
        obj.content = message.content;
        obj.type = message.type;
        obj.to = message.to;
        obj.from = message.from;
        obj.time = new Date().getTime() + '';
        obj.user = message.from;
        obj.operate = '';
        obj.status = 0;
        try {
            return await this.mongoMessageRepository.insertOne(obj);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查找用户用户
     * @param messageUser
     */
    public async findMessageUser(messageUser: QueryMessageUserDto) {
        try {
            const res = await this.mongoMessageUserRepository.find();
            return await this.mongoMessageUserRepository.findOne({userId: messageUser.userId});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查找用户用户
     * @param messageUser
     */
    public async createMessageUser(messageUser: MessageUserDto) {
        try {
            return await this.mongoMessageUserRepository.insertOne(messageUser);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查找用户
     * @param queryUserFriends
     */
    public async queryUserInfo(queryUserList: QueryUserList) {
        try {
            const userId = queryUserList.userId;
            return await this.mongoMessageUserRepository.findOne({userId});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查找用户群组
     * @param queryUserFriends
     */
    public async queryUserGroups(queryUserList: QueryUserList) {
        try {
            const userId = queryUserList.userId;
            return await this.mongoMessageUserRepository.findOne({userId});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 批量查找群组
     * @param queryUserFriends
     */
    public async queryManyUserGroups(queryUserList: QueryUserList) {
        try {
            return await this.mongoMessageUserRepository.findOne({userId: queryUserList.userId});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 批量查找用户
     * @param queryUserFriends
     */
    public async queryManyUserFriends(userIds: Array<number | string>) {
        try {
            const user = userIds.map((item: string) => {
                return Number(item);
            });
            return await this.mongoLineRepository.find({where: {userId: {$in: user}}});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查找聊天记录
     * @param params
     */
    public async queryUserMessageListAll(params: QueryUserMessageListDto) {
        try {
            const time = new Date().setHours(0, 0, 0, 0) - 86400000 * 3;
            const formId = Number(params.fromId);
            const userId = Number(params.userId);
            return await this.mongoMessageRepository.find({where: {
                    to: {
                        $in: [formId, userId],
                    },
                    from: {
                        $in: [formId, userId],
                    },
                    time: {
                        $gt: params.minTime ? params.minTime : time}}});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查找通知（聊天）
     * @param params
     */
    public async messageByToUser(params: QueryUserMessageListDto) {
        try {
            const time = new Date().setHours(0, 0, 0, 0) - 86400000 * 3;
            return await this.mongoMessageRepository.find({where: {to: Number(params.userId), time: {$gt: params.minTime ? params.minTime : time}}});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查询用户信息
     * @param id
     */
    public async findUserInfo(ids: Array<number |string>): Promise<any> {
        return await this.httpService
            .get(`${httpUrl.userApi}/user/infoByIds`, {params: {ids}})
            .toPromise();
    }

    /**
     * 查询我的消息
     * @param query
     */
    public async queryMyMessage(query: QueryMyMessageListDto) {
        const {userId} = query;
        try {
            const res = await this.mongoMessageRepository.find({where: {
                    to: {
                        $in: [userId],
                    },
                    time: {
                        $gt: query ? '' : ''}}});
            return res;
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }
}

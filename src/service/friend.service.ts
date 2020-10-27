import {HttpService, Injectable} from '@nestjs/common';
import {UserMap} from '../model/mongoEntity/friend.entity';
import {ApiException} from '../common/error/exceptions/api.exception';
import {ApiErrorCode} from '../config/api-error-code.enum';
import {InjectRepository} from '@nestjs/typeorm';
import {Column, MongoRepository, ObjectIdColumn} from 'typeorm';
import { ObjectID } from 'mongodb';
import {ImAddRequestEntity} from '../model/mongoEntity/imAddRequest.entity';
import {RequestAddFriendDto} from '../model/DTO/friend/requestAddFriend.dto';
import {RequestCallBackDto} from '../model/DTO/friend/requestCallBack.dto';
import {httpUrl} from '../config/config';

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(UserMap) private readonly userMapRepository: MongoRepository<UserMap>,
        @InjectRepository(ImAddRequestEntity) private readonly imAddRequestEntityRepository: MongoRepository<ImAddRequestEntity>,
        private readonly httpService: HttpService,
    ) {}

    /**
     * 获取好友列表
     * @param userId
     */
    public async getFriends(userId: number): Promise<[UserMap[], number]> {
        try {
            return await this.userMapRepository.findAndCount({userId: Number(userId)});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 获取好友的聊天列表
     * @param userId
     * @param friendId
     */
    public async getFriendMessages(userId: string, friendId: string) {
        try {
            return await this.userMapRepository.findAndCount();
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 请求添加
     * @param params
     */
    public async requestAddFriend(params: RequestAddFriendDto) {
        try {
            await this.httpService.post(`${httpUrl.pushApi}/amqpMessage/newFriendRequest`, params).toPromise();
            return await this.imAddRequestEntityRepository.insertOne({
                targetId: params.targetId,
                targetName: params.targetName,
                targetIcon: params.targetIcon,
                formId: params.formId,
                type: params.type,
                note: params.note,
                state: false,
                callBackType: 1,
            });
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 好友请求反馈
     * @param params
     */
    public async callbackRequest(params: RequestCallBackDto) {
        try {
            const requestInfo: ImAddRequestEntity = await this.imAddRequestEntityRepository.findOne(params.id);
            await this.imAddRequestEntityRepository.updateOne({
                _id: new ObjectID(params.id),
            },  { $set: {
                callBackType: params.callBackType, state: true,
            } });
            if (params.callBackType === 2) {
                if (requestInfo.type === 'FRIEND') {
                    await this.createFriend(requestInfo);
                }
                if (requestInfo.type === 'GROUP') {
                    await this.userMapRepository.insertOne({friendId: requestInfo.targetId, userId: requestInfo.formId});
                }
            }
            if (params.callBackType === 3) {
                await this.imAddRequestEntityRepository.updateOne({_id: new ObjectID(params.id)}, {callBackType: 3, state: false});
            }
        } catch (e) {
            console.log(e);
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 新增好友
     */
    public async createFriend(requestInfo: ImAddRequestEntity) {
        try {
            const userFriendInfo: UserMap[] = await this.userMapRepository.find({
                userId: requestInfo.formId,
                friendId: requestInfo.targetId,
                friendName: requestInfo.targetName,
                friendIcon: requestInfo.targetIcon,
            });
            if (!userFriendInfo || userFriendInfo.length === 0) {
                await this.userMapRepository.insertOne({
                    friendId: requestInfo.targetId,
                    userId: requestInfo.formId,
                    friendName: requestInfo.targetName,
                    friendIcon: requestInfo.targetIcon,
                });
            }
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }
}

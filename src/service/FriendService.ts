import {HttpService, Injectable} from '@nestjs/common';
import {UserMap} from '../model/mongoEntity/FriendEntity';
import {ApiException} from '../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../config/ApiErrorCodeEnum';
import {InjectRepository} from '@nestjs/typeorm';
import {Column, MongoRepository, ObjectIdColumn} from 'typeorm';
import { ObjectID } from 'mongodb';
import {ImAddRequestEntity} from '../model/mongoEntity/ImAddRequestEntity';
import {RequestAddFriendDto} from '../model/DTO/friend/RequestAddFriend.dto';
import {RequestCallBackDto} from '../model/DTO/common/RequestCallBack.dto';
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
    public async getFriends(userId: string): Promise<[UserMap[], number]> {
        try {
            return await this.userMapRepository.findAndCount({userId: userId.toString()});
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
                targetId: params.targetId.toString(),
                targetName: params.targetName,
                targetIcon: params.targetIcon,
                formId: params.formId.toString(),
                formName: params.formName,
                formIcon: params.formIcon,
                type: params.type,
                note: params.note,
                state: false,
                callBackType: 1,
                createTime: new Date().getTime(),
                updateTime: new Date().getTime(),
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
            // 1 未应答 2： 同意  3： 不同意
            const requestInfo: ImAddRequestEntity = await this.imAddRequestEntityRepository.findOne(params.id);
            await this.imAddRequestEntityRepository.updateOne({
                _id: new ObjectID(params.id),
            },  { $set: {
                callBackType: params.callBackType, state: true, updateTime: new Date().getTime(),
            } });
            if (params.callBackType === 2) {
                if (requestInfo.type === 'FRIEND') {
                    await this.createFriend(requestInfo);
                }
                if (requestInfo.type === 'GROUP') {
                    await this.userMapRepository.insertOne({friendId: requestInfo.targetId.toString(), userId: requestInfo.formId.toString()});
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
                userId: requestInfo.formId.toString(),
                friendId: requestInfo.targetId.toString(),
                friendName: requestInfo.targetName,
                friendIcon: requestInfo.targetIcon,
            });
            if (!userFriendInfo || userFriendInfo.length === 0) {
                // 加入两个联系人信息
                const friendList = [
                    {
                        friendId: requestInfo.targetId.toString(),
                        userId: requestInfo.formId.toString(),
                        friendName: requestInfo.targetName,
                        friendIcon: requestInfo.targetIcon,
                    },
                    {
                        friendId: requestInfo.formId.toString(),
                        userId: requestInfo.targetId.toString(),
                        friendName: requestInfo.userName,
                        friendIcon: requestInfo.targetIcon,
                    },
                ];
                await this.userMapRepository.insertMany(friendList);
            }
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 获取好友的添加请求
     * @param userId
     */
    public async requestAddFriendList(userId: any) {
        try {
           return await this.imAddRequestEntityRepository.findAndCount({targetId: userId});
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 好友请求列表
     * @param targetId
     */
    public async getFriendRequest(targetId: any) {
        const page: number = 1;
        const pageSize = 100;
        const targetIdStr = targetId.toString();
        try {
            const requestRes: [ImAddRequestEntity[], number] = await this.imAddRequestEntityRepository.findAndCount(
                {skip: (page - 1) * pageSize,
                    take: pageSize,
                    order: { createTime: 'DESC'},
                    where: {
                        targetId: targetIdStr,
                    },
                });
            return requestRes;
        } catch (e) {
            console.log(e);
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 我的请求
     * @param userId
     */
    public async getMyRequest(userId: any) {
        const page: number = 1;
        const pageSize = 100;
        const userIdStr = userId.toString();
        try {
            const requestRes: [ImAddRequestEntity[], number] = await this.imAddRequestEntityRepository.findAndCount(
                {skip: (page - 1) * pageSize,
                    take: pageSize,
                    order: { createTime: 'DESC'},
                    where: {
                        formId: userIdStr,
                    },
                });
            return requestRes;
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 初始化机器人信息
     * @param userId
     */
    public async initRobotUser(userId, userName) {
        try {
            const res = await this.httpService.get(`${httpUrl.userApi}/user/getUserInfoByName?name=systemRobot`, {headers: {ignoreToken: 'true'}}).toPromise();
            const robotUserId = res.data.data.data.id;
            const flag = await this.userMapRepository.find({
                userId: userId.toString(),
                friendId: robotUserId.toString(),
            });
            if (!flag.length) {
                // 加入两个联系人信息
                const friendList = [
                    {
                        friendId: robotUserId.toString(),
                        userId: userId.toString(),
                        friendName: res.data.data.data.name,
                        friendIcon: 'http://qiniu.canyuegongzi.xyz/person_timg.jpg',
                    },
                    {
                        friendId: userId.toString(),
                        userId: robotUserId.toString(),
                        friendName: userName,
                        friendIcon: 'http://qiniu.canyuegongzi.xyz/person_timg.jpg',
                    },
                ];
                await this.userMapRepository.insertMany(friendList);
            }
            return res.data.data;
        } catch (e) {
            console.log(e);
        }
    }
}

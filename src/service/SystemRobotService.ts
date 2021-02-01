import {HttpService, Injectable} from '@nestjs/common';
import {httpUrl, robotConfig} from '../config/config';
import {ExpriesMemoryCacheService} from './ExpriesMemoryCacheService';
import {ApiException} from '../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../config/ApiErrorCodeEnum';
import {InjectRepository} from '@nestjs/typeorm';
import {Column, MongoRepository} from 'typeorm';
import {RobotMessageEntity} from '../model/mongoEntity/RobotMessageEntity';
import {EventEmitter} from 'events';
import {Emitter, NestEventEmitter} from 'nest-event';
import {QueryRobotDto} from '../model/DTO/robot/QueryRobotDto';
import {UtilService} from './UtilService';

@Injectable()
@Emitter('emit-robot-message')
export class SystemRobotService extends EventEmitter {
    constructor(
        @InjectRepository(RobotMessageEntity) private readonly robotMessageMapRepository: MongoRepository<RobotMessageEntity>,
        private readonly httpService: HttpService,
        private readonly utilService: UtilService,
        private readonly nestEventEmitter: NestEventEmitter,
    ) {
        super();
    }

    /**
     * 获取聊天回复
     * // https://ai.baidu.com/ai-doc/UNIT/Ykipmifh6
     * // https://ai.baidu.com/forum/topic/show/944007
     * // https://ai.baidu.com/unit/v2#/servicesecondary/S44232/chat/serviceskill
     */
    public async getChitchatMessage(queryDto: QueryRobotDto, query: string, multiWheel: boolean = false, otherQuery: any = { logId: null, botSession: ''}) {
        let token: string = ExpriesMemoryCacheService.get('robotToken');
        if (!token) {
            const tokenRes: any = await this.initAccessToken();
            token = tokenRes.access_token;
            ExpriesMemoryCacheService.set('robotToken', token, 60 * 60 * 24);
        }
        const url = `https://aip.baidubce.com/rpc/2.0/unit/bot/chat?access_token=${token}`;
        const data = {
            bot_session: otherQuery.botSession || '',
            log_id: otherQuery.logId || new Date().getTime(),
            request: {
                bernard_level: 1,
                query,
                query_info: {
                    asr_candidates: [],
                    source: 'KEYBOARD',
                    type: 'TEXT',
                },
                updates: '',
                user_id: robotConfig.userId,
            },
            bot_id: otherQuery.botId || robotConfig.botId,
            version: '2.0',
        };
        try {
            return new Promise(async (resolve, reject) => {
                const res = await this.httpService.post(url, data).toPromise();
                const answerData = this.formatOneSay(res.data);
                this.nestEventEmitter.emitter('emit-robot-message').emit('insert-robot-message', this.getStoreMessageList(queryDto, answerData));
                resolve({answerData});
            });
        } catch (e) {
            console.log(e);
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 获取token https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=API Key&client_secret=Secret Key&
     */
    public async initAccessToken() {
        try {
            const url: string = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${robotConfig.appKey}&client_secret=${robotConfig.SecretKey}&`;
            const res: any = await this.httpService.post(url).toPromise();
            return res.data;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * 格式化返回数据
     * @param data
     */
    public formatOneSay(data) {
        if (data.result.response.msg === 'ok') {
            const sayObj = {
                answer: data.result.response.action_list[0].say,
                botId: data.result.bot_id,
                logId: data.result.log_id,
                botSession: data.result.bot_session,
                interactionId: data.result.interaction_id,
                answerList: data.result.response.action_list.map((item) => {
                    return {
                        answer: item.say,
                        type: item.type,
                    };
                }),
            };
            return sayObj;
        }
        return {};
    }

    /**
     * 序列化需要存儲的信息列表
     */
    public getStoreMessageList(requestDto: QueryRobotDto, answerDto: any ) {
        const currentTime: number = new Date().getTime();
        const messageStr1: string = requestDto.userId + '_' + requestDto.targetId + '_' + currentTime;
        const hashId1: string = this.utilService.createUuid(messageStr1);
        const messageStr2: string = requestDto.targetId + '_' + requestDto.userId + '_' + currentTime;
        const hashId2: string = this.utilService.createUuid(messageStr2);
        const data1 = {
            userId: requestDto.userId,
            friendId: requestDto.targetId,
            content: requestDto.content,
            type: 'TEXT',
            createTime: new Date().getTime(),
            hashId: hashId1,
            status: 0 + '',
        };
        const data2 = {
            userId: requestDto.targetId,
            friendId: requestDto.userId,
            content: answerDto.answer,
            type: 'TEXT',
            createTime: new Date().getTime(),
            hashId: hashId2,
            status: 0 + '',
        };
        return [data1, data2];
    }

}

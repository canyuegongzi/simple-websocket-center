import {SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import { Inject } from '@nestjs/common';
import {RedisCacheService} from './RedisCacheService';
import {ConnectionUserOptions} from '../model/DTO/ws/ConnectionUserOptions';
import {EventEmitter} from 'events';
import {Emitter, From, On} from 'nest-event';
import {WsFriendMessageInfo} from '../model/DTO/ws/WsFriendMessageInfo';
import {RequestAddFriendDto} from '../model/DTO/friend/RequestAddFriend.dto';
import {AffirmChatMessageDto} from '../model/DTO/messageStore/AffirmChatMessageDto';
import {AmqpConnection} from '@golevelup/nestjs-rabbitmq';
import {rabbitMQConfig} from '../config/config';
import {WsGroupMessageInfo} from '../model/DTO/ws/WsGroupMessageInfo';
import {HeartbeatService} from './HeartbeatService';

@WebSocketGateway(9010 )
export class ChatServerGateway extends EventEmitter implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit  {
    @WebSocketServer()
    server: Server;
    constructor(
        @Inject(RedisCacheService) private readonly redisCacheService: RedisCacheService,
        @Inject(HeartbeatService) private readonly heartbeatService: HeartbeatService,
        private readonly messageClient: AmqpConnection,
    ) {
        super();
    }

    public afterInit(data) {
        console.log('websocket初始化success');
    }

    /**
     * 客户端连接
     * @param client
     */
    public async handleConnection(client: Socket): Promise<any> {
        return Promise.all([this.initUserSocket(client), this.initGroupSocket(client)]);
    }

    /**
     * 客户端断开连接
     * @param client
     */
    public async handleDisconnect(client: Socket) {
        const query: ConnectionUserOptions = client.handshake.query;
        const redisUserInfo: ConnectionUserOptions[] = await this.redisCacheService.get('WS-' + query.userId);
        if (redisUserInfo && Array.isArray(redisUserInfo)) {
            for (let i = redisUserInfo.length - 1; i >= 0 ; i--) {
                if (redisUserInfo[i].deviceType === query.deviceType && redisUserInfo[i].userId === query.userId) {
                    redisUserInfo.splice(i, 1);
                }
            }
        }
        if (redisUserInfo && Array.isArray(redisUserInfo) && redisUserInfo.length > 0) {
            await this.redisCacheService.set('WS-' + query.userId, redisUserInfo);
        } else {
            await this.redisCacheService.delete('WS-' + query.userId);
        }
    }

    /**
     * 订阅消息（好友消息通道）
     */
    @From('emit-websocket-message')
    @On('friend-message')
    public async onSubscribeEmitMessage(params: WsFriendMessageInfo)  {
        try {
            const redisUserInfo: ConnectionUserOptions[] = await this.redisCacheService.get('WS-' + params.friendId);
            if (redisUserInfo && Array.isArray(redisUserInfo)) {
                for (let i = 0 ; i < redisUserInfo.length; i++) {
                    this.server.to(redisUserInfo[i].client).emit('friendMessage',  {...params});
                }
            }
        } catch (e) {
            console.log('推送失败');
        }
    }

    /**
     * 订阅消息（好友消息通道）
     */
    @From('emit-websocket-message')
    @On('group-message')
    public async onSubscribeEmitGroupMessage(params: WsGroupMessageInfo) {
        console.log('群消息开始处理');
        console.log(params);
        const targetIds: string[] = params.targetIds.split(',');
        try {
            console.log(params);
            for (let i = 0; i < targetIds.length; i ++) {
                const redisUserInfo: ConnectionUserOptions[] = await this.redisCacheService.get('WS-' + targetIds[i]);
                if (redisUserInfo && Array.isArray(redisUserInfo)) {
                    for (let j = 0 ; j < redisUserInfo.length; j++) {
                        this.server.to(redisUserInfo[j].client).emit('groupMessage',  {
                            content: params.content,
                            createTime: params.createTime,
                            groupId: params.groupId,
                            hashId: params.hashId,
                            type: params.type,
                            userId: params.userId,
                        });
                    }
                }
            }
        } catch (e) {
            console.log('推送失败');
        }
    }

    /**
     * 系统操作问题信息
     */
    @From('emit-websocket-message')
    @On('new-request')
    public async onSubscribeEmitRequest(params: RequestAddFriendDto) {
        if (params.type === 'FRIEND') {
            return this.emitFriendRequest(params);
        }
        if (params.type === 'GROUP') {
            return this.emitGroupRequest(params);
        }
    }

    /**
     * 获取客户端的消息
     * @param client
     * @param message
     */
    @SubscribeMessage('affirmMessageStatus')
    public async getClientMessage(client: Socket, message: AffirmChatMessageDto) {
        try {
            await this.messageClient.publish(rabbitMQConfig.websocketAffirmMessage, 'affirm-message', JSON.stringify(message));
            console.log('向消息队列push消息状态success');
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * 个人点对点请求处理(添加好友)
     * @param params
     */
    public async emitFriendRequest(params: RequestAddFriendDto) {
        try {
            console.log('开始推送好友请求消息');
            const redisUserInfo: ConnectionUserOptions[] = await this.redisCacheService.get('WS-' + params.targetId);
            if (redisUserInfo && Array.isArray(redisUserInfo)) {
                for (let i = 0 ; i < redisUserInfo.length; i++) {
                    this.server.to(redisUserInfo[i].client).emit('newRequest',  {...params});
                }
            }
        } catch (e) {
            console.log('推送失败');
        }
    }

    /**
     * 群添加请求处理(添加群组)
     * @param params
     */
    public async emitGroupRequest(params: RequestAddFriendDto) {
        console.log('添加群组请求');
        try {
            // 向管理员和群主推送消息
            const targetIds = params.targetId.split(',');
            for (let i = 0; i < targetIds.length; i ++) {
                console.log('开始推送群组请求消息');
                const redisUserInfo: ConnectionUserOptions[] = await this.redisCacheService.get('WS-' + targetIds[0]);
                if (redisUserInfo && Array.isArray(redisUserInfo)) {
                    for (let j = 0 ; j < redisUserInfo.length; j++) {
                        this.server.to(redisUserInfo[j].client).emit('newGroupRequest',  {...params});
                    }
                }
            }
        } catch (e) {
            console.log('推送失败');
        }
    }

    /**
     * 初始化用户（维护单聊socket | redis缓存客户端）
     * @param client
     */
    public async initUserSocket(client: Socket) {
        const query: ConnectionUserOptions = client.handshake.query;
        const redisUserInfo: ConnectionUserOptions[] = await this.redisCacheService.get('WS-' + query.userId);
        if (!redisUserInfo) {
            await this.redisCacheService.set('WS-' + query.userId, [{ client: client.id, userId: query.userId, deviceType: query.deviceType  }]);
        }
        if (redisUserInfo && Array.isArray(redisUserInfo)) {
            let indexFlag: number = 0;
            const hasFlag: boolean = redisUserInfo.some((item, index) => {
                if (item.deviceType === query.deviceType) {
                    indexFlag = index;
                }
                return item.deviceType === query.deviceType;
            });
            if (!hasFlag) {
                await this.redisCacheService.set('WS-' + query.userId,
                    redisUserInfo.concat([{
                        client: client.id,
                        userId: query.userId,
                        deviceType: query.deviceType }]));
            } else {
                redisUserInfo.splice(indexFlag, 1, {client: client.id, userId: query.userId, deviceType: query.deviceType});
                await this.redisCacheService.set('WS-' + query.userId, redisUserInfo);
            }
        }
    }

    /**
     * 初始化用户（维护群聊socket）
     * @param client
     */
    public async initGroupSocket(client: Socket) {
        const query: ConnectionUserOptions = client.handshake.query;
    }
}

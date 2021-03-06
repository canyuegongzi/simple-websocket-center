import {Injectable} from '@nestjs/common';
import moment = require('moment');
import {Ctx, Payload, RmqContext} from '@nestjs/microservices';
import {RabbitRPC} from '@golevelup/nestjs-rabbitmq';
import {rabbitMQConfig} from '../config/config';
import {EventEmitter} from 'events';
import {Emitter, NestEventEmitter} from 'nest-event';
import {WsFriendMessageInfo} from '../model/DTO/ws/WsFriendMessageInfo';
moment.locale('zh-cn');

/**
 * 及时通讯消息订阅
 */
@Injectable()
@Emitter('emit-websocket-message')
export class AmqpMessageConsumerService extends EventEmitter {
    public numIndex: number = 0;
    constructor(private readonly nestEventEmitter: NestEventEmitter) {
        super();
    }

    /**
     * 好友消息队列订阅
     * @param message
     * @param context
     */
    @RabbitRPC({
        exchange: rabbitMQConfig.websocketFriendMessageSubscribe,
        routingKey: 'friend-route',
        queue: rabbitMQConfig.websocketFriendMessageQueue,
    })
    public taskSubscriberFriend(@Payload() message: any, @Ctx() context: RmqContext ) {
        const data: WsFriendMessageInfo = JSON.parse(message);
        this.numIndex ++;
        this.nestEventEmitter.emitter('emit-websocket-message').emit('friend-message', data);
        return {
            response: 42,
        };
    }

    /**
     * 系统操作订阅
     * @param message
     * @param context
     */
    @RabbitRPC({
        exchange: rabbitMQConfig.websocketRequestExchange,
        routingKey: 'new-request',
        queue: rabbitMQConfig.websocketRequestQueue,
    })
    public taskSubscriberRequest(@Payload() message: any, @Ctx() context: RmqContext ) {
        const data: any = JSON.parse(message);
        this.nestEventEmitter.emitter('emit-websocket-message').emit('new-request', data);
        return true;
    }

    /**
     * 群组消息订阅
     * @param message
     * @param context
     */
    @RabbitRPC({
        exchange: rabbitMQConfig.websocketGroupMessageSubscribe,
        routingKey: 'group-route',
        queue: rabbitMQConfig.websocketGroupMessageQueue,
    })
    public taskSubscriberGroup(@Payload() message: any, @Ctx() context: RmqContext ) {
        const data: any = JSON.parse(message);
        this.nestEventEmitter.emitter('emit-websocket-message').emit('group-message', data);
    }

    /**
     * 消息确认
     * @param message
     * @param context
     */
    @RabbitRPC({
        exchange: rabbitMQConfig.websocketAffirmMessage,
        routingKey: 'affirm-message',
        queue: rabbitMQConfig.websocketAffirmQueue,
    })
    public taskSubscriberAffirmMessage(@Payload() message: any, @Ctx() context: RmqContext ) {
        const data: any = JSON.parse(message);
        this.nestEventEmitter.emitter('emit-websocket-message').emit('affirm-message', data);
    }
}

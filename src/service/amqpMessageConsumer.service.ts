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

    @RabbitRPC({
        exchange: rabbitMQConfig.websocketFriendMessageSubscribe,
        routingKey: 'friend-route',
        queue: rabbitMQConfig.websocketFriendMessageQueue,
    })
    public taskSubscriberFriend(@Payload() message: any, @Ctx() context: RmqContext ) {
        const data: WsFriendMessageInfo = JSON.parse(message);
        console.log(data);
        this.numIndex ++;
        console.log(`rabbit接收到了广播的第${this.numIndex}消息队列`);
        this.nestEventEmitter.emitter('emit-websocket-message').emit('friend-message', data);
        console.log('消息已经处理了');
        return {
            response: 42,
        };
    }

    @RabbitRPC({
        exchange: rabbitMQConfig.websocketRequestExchange,
        routingKey: 'new-request',
        queue: rabbitMQConfig.websocketRequestQueue,
    })
    public taskSubscriberRequest(@Payload() message: any, @Ctx() context: RmqContext ) {
        const data: any = JSON.parse(message);
        console.log('好一派');
        console.log(data);
        this.nestEventEmitter.emitter('emit-websocket-message').emit('new-request', data);
        return {
            response: 42,
        };
    }

    @RabbitRPC({
        exchange: rabbitMQConfig.websocketGroupMessageSubscribe,
        routingKey: 'subscribe-group-route',
        queue: rabbitMQConfig.websocketGroupMessageQueue,
    })
    public taskSubscriberGroup(@Payload() message: any, @Ctx() context: RmqContext ) {
        console.log('rabbit接收到了一个群信息新的任务，开始干活了');
        const data: any = JSON.parse(message);
        console.log(data);
    }

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

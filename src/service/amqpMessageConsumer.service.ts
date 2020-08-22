import {Injectable} from '@nestjs/common';
import moment = require('moment');
import {Ctx, MessagePattern, Payload, RmqContext} from '@nestjs/microservices';
import {RabbitRPC} from '@golevelup/nestjs-rabbitmq';
import {rabbitMQConfig} from '../config/config';
moment.locale('zh-cn')

@Injectable()
export class AmqpMessageConsumerService {

    constructor() {}

    @RabbitRPC({
        exchange: rabbitMQConfig.websocketFriendMessageSubscribe,
        routingKey: 'subscribe-friend-route',
        queue: rabbitMQConfig.websocketFriendMessageQueue,
    })
    public taskSubscriberFriend(@Payload() message: any, @Ctx() context: RmqContext ) {
        console.log('rabbit接收到了广播的消息队列');
        const data: any = JSON.parse(message);
        console.log(data);
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
}

import {Inject, Injectable} from '@nestjs/common';
import moment = require('moment');
moment.locale('zh-cn');
import {AmqpConnection, RabbitRPC} from '@golevelup/nestjs-rabbitmq';
import {rabbitMQConfig} from '../config/config';

@Injectable()
export class AmqpMessageProductService {
    constructor(
        private readonly messageClient: AmqpConnection,
    ) {
        console.log(888);
    }

    /**
     * 广播好友信息
     */
    public async sendFriendMessage(data: any) {
        return new Promise((async (resolve, reject) => {
            try {
                await this.messageClient.publish(rabbitMQConfig.websocketFriendMessageExchange, 'friend-publish-route', JSON.stringify(data));
                resolve({success: true, data});
                console.log('向消息队列push消息success');
            } catch (e) {
                console.log(e);
                reject({ success: false, e});
            }
        }));
    }

    /**
     * 发送好友信息
     */
    public async sendGroupMessage(data: any) {
        return new Promise((async (resolve, reject) => {
            try {
                await this.messageClient.publish(rabbitMQConfig.websocketGroupMessageExchange, 'group-publish-route', JSON.stringify(data));
                resolve({success: true, data});
            } catch (e) {
                console.log(e);
                reject({ success: false, e});
            }
        }));
    }
}

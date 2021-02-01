import { Module} from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {rabbitMQConfig} from '../config/config';
import {AmqpMessageConsumerService} from '../service/AmqpMessageConsumerService';
import {AmqpMessageProductService} from '../service/AmqpMessageProductService';
import {AmqpMessageController} from '../controller/AmqpMessageController';

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: rabbitMQConfig.websocketFriendMessageExchange,
                    type: 'topic',
                },
                {
                    name: rabbitMQConfig.websocketGroupMessageExchange,
                    type: 'topic',
                },
                {
                    name: rabbitMQConfig.websocketRequestExchange,
                    type: 'topic',
                },
                {
                    name: rabbitMQConfig.websocketAffirmMessage,
                    type: 'topic',
                },
            ],
            uri: rabbitMQConfig.url,
        }),
    ],
    controllers: [AmqpMessageController],
    providers: [ AmqpMessageProductService, AmqpMessageConsumerService],
    exports: [],
})
export class AmqpMessageModule {}

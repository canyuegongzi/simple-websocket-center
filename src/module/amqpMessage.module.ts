import { Module} from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {rabbitMQConfig} from '../config/config';
import {AmqpMessageConsumerService} from '../service/amqpMessageConsumer.service';
import {AmqpMessageProductService} from '../service/amqpMessageProduct.service';
import {AmqpMessageController} from '../controller/amqpMessage.controller';

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
            ],
            uri: rabbitMQConfig.url,
        }),
    ],
    controllers: [AmqpMessageController],
    providers: [ AmqpMessageProductService, AmqpMessageConsumerService],
    exports: [],
})
export class AmqpMessageModule {}


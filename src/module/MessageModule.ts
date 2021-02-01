import { forwardRef, HttpModule, Module } from '@nestjs/common';
import {InjectRepository, TypeOrmModule} from '@nestjs/typeorm';
import {ChatServerGateway} from '../service/ChatServerGateway';
import {RedisCacheService} from '../service/RedisCacheService';
import {RabbitMQModule} from '@golevelup/nestjs-rabbitmq';
import {rabbitMQConfig} from '../config/config';
import {HeartbeatService} from '../service/HeartbeatService';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    HttpModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: rabbitMQConfig.websocketRequestExchange,
          type: 'topic',
        },
      ],
      uri: rabbitMQConfig.url,
    }),
  ],
  providers: [ChatServerGateway, RedisCacheService, HeartbeatService],
  controllers: [],
  exports: [ChatServerGateway],
})
export class MessageModule {}

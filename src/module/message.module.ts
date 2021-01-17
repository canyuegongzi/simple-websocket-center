import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MessageController } from '../controller/message.controller';
import { MessageService } from '../service/message.service';
import {InjectRepository, TypeOrmModule} from '@nestjs/typeorm';
import {MessageGroupEntity} from '../model/mongoEntity/messageGroup.entity';
import {LineEntity} from '../model/mongoEntity/line.entity';
import {MessageEntity} from '../model/mongoEntity/message.entity';
import {MessageUserEntity} from '../model/mongoEntity/messageUser.entity';
import {ChatServerGateway} from '../service/chatServer.gateway';
import {RedisCacheService} from '../service/redisCache.service';
import {TypeEntity} from '../model/mongoEntity/type.entity';
import {RabbitMQModule} from '@golevelup/nestjs-rabbitmq';
import {rabbitMQConfig} from '../config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([LineEntity, MessageEntity, MessageGroupEntity, MessageUserEntity, TypeEntity]),
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
  providers: [MessageService, ChatServerGateway, RedisCacheService],
  controllers: [MessageController],
  exports: [ChatServerGateway],
})
export class MessageModule {}

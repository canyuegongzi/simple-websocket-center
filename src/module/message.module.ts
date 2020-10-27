import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MessageController } from '../controller/message.controller';
import { MessageService } from '../service/message.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MessageGroupEntity} from '../model/mongoEntity/messageGroup.entity';
import {LineEntity} from '../model/mongoEntity/line.entity';
import {MessageEntity} from '../model/mongoEntity/message.entity';
import {MessageUserEntity} from '../model/mongoEntity/messageUser.entity';
import {RequestMessageEntity} from '../model/mongoEntity/requestMessage.entity';
import {TypeEntity} from '../model/mongoEntity/type.entity';
import {ChatServerGateway} from '../service/chatServer.gateway';
import {RedisCacheService} from '../service/redisCache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LineEntity, MessageEntity, MessageGroupEntity, MessageUserEntity, RequestMessageEntity, TypeEntity] ),
    HttpModule,
  ],
  providers: [MessageService, ChatServerGateway, RedisCacheService],
  controllers: [MessageController],
  exports: [ChatServerGateway],
})
export class MessageModule {}

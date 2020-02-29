import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from '../controller/message.controller';
import { MessageService } from '../service/service/message.service';
// import { Message } from '../model/entity/message.entity';
import { Message} from '../model/mongoEntity/message.entity';
import { ChatsGateway } from '../common/event/chat.gateway';
import { GatewaysExceptionFilter } from '../common/error/filters/ws-exception.filter';
import {Type} from '../model/mongoEntity/type.entity';
import {Line} from '../model/mongoEntity/line.entity';
import {RequestMessage} from '../model/mongoEntity/requestMessage.entity';
import {MessageUser} from '../model/mongoEntity/messageUser.entity';
import {MessageGroup} from '../model/mongoEntity/messageGroup.entity';

@Module({
  imports: [
    HttpModule,
    // TypeOrmModule.forFeature([Message], 'mysqlCon'),
    TypeOrmModule.forFeature([Message, Type, Line, RequestMessage, MessageUser, MessageGroup], 'mongoCon'),
  ],
  providers: [MessageService,  ChatsGateway, GatewaysExceptionFilter],
  controllers: [MessageController],
  exports: [],
})
export class MessageModule {}

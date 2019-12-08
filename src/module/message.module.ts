import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from '../controller/message.controller';
import { MessageService } from '../service/service/message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from '../schemas/message.schema';
import { Message } from '../model/entity/message.entity';
import { TypeSchema } from '../schemas/type.schema';
import { InitService } from '../service/service/init.service';
import { ChatsGateway } from '../common/event/chat.gateway';
import { GatewaysExceptionFilter } from '../common/error/filters/ws-exception.filter';
import { LineSchema } from '../schemas/line.schema';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Message]),
    MongooseModule.forFeature([ // Schema 定义数据库的结构
      { name: 'Message', schema: MessageSchema },
      { name: 'Type', schema: TypeSchema }, // name: 'Cat'  cats 表， Cat 必须和service时@InjectModel('Cat')的一样
      { name: 'Line', schema: LineSchema }, // name: 'Cat'  cats 表， Cat 必须和service时@InjectModel('Cat')的一样
    ]),
  ],
  providers: [MessageService,  ChatsGateway, GatewaysExceptionFilter],
  controllers: [MessageController],
  exports: [],
})
export class MessageModule {}

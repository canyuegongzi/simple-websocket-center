import { Module } from '@nestjs/common';
import { RedisModule} from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './module/message.module';
import { MessageGroupEntity} from './model/mongoEntity/messageGroup.entity';
import { LineEntity} from './model/mongoEntity/line.entity';
import {MessageEntity} from './model/mongoEntity/message.entity';
import {MessageUserEntity} from './model/mongoEntity/messageUser.entity';
import {RequestMessageEntity} from './model/mongoEntity/requestMessage.entity';
import {TypeEntity} from './model/mongoEntity/type.entity';
import {AmqpMessageModule} from './module/amqpMessage.module';
import {redisConfig} from './config/config';
import {EventModule} from './module/event.module';
import {UserMap} from './model/mongoEntity/friend.entity';
import {FriendModule} from './module/friend.module';
import {ImAddRequestEntity} from './model/mongoEntity/imAddRequest.entity';
import { FriendMessageEntity } from './model/noticePersistence/friendMessage.entity';
import {GroupMessageEntity} from './model/noticePersistence/groupMessage.entity';
import {FriendMessageOffLineEntity} from './model/noticePersistence/friendMessageOffLine.entity';
import {MessageStoreModule} from './module/messageStore.module';
import {SystemRobotModule} from './module/SystemRobot.module';
import {RobotMessageEntity} from './model/mongoEntity/robotMessage.entity';
@Module({
  imports: [
    RedisModule.register(redisConfig),
    TypeOrmModule.forRoot(
        {
            name: 'default',
            type: 'mongodb',
            // host: '127.0.0.1',
            host: '148.70.150.131',
            port: 27017,
            useNewUrlParser: true,
            database: 'simple_message_center',
            synchronize: true,
            authSource: 'admin',
            username: 'root',
            password: '123ADD123ADD',
            entities: [LineEntity, MessageEntity, MessageGroupEntity, MessageUserEntity, RequestMessageEntity, TypeEntity, UserMap, ImAddRequestEntity, RobotMessageEntity ],
        },
    ),
      TypeOrmModule.forRoot(
          {
              name: 'noticePersistence',
              type: 'mongodb',
              // host: '127.0.0.1',
              host: '148.70.150.131',
              port: 27017,
              useNewUrlParser: true,
              database: 'notice',
              synchronize: true,
              authSource: 'admin',
              username: 'root',
              password: '123ADD123ADD',
              entities: [FriendMessageEntity, GroupMessageEntity, FriendMessageOffLineEntity],
          },
      ),
    MessageModule, EventModule, FriendModule, SystemRobotModule,
    AmqpMessageModule, MessageStoreModule,
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class MainModule {}

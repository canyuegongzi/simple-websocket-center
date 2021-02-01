import { Module } from '@nestjs/common';
import { RedisModule} from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './module/MessageModule';
import {RequestMessageEntity} from './model/mongoEntity/RequestMessageEntity';
import {AmqpMessageModule} from './module/AmqpMessageModule';
import {redisConfig} from './config/config';
import {EventModule} from './module/EventModule';
import {UserMap} from './model/mongoEntity/FriendEntity';
import {FriendModule} from './module/FriendModule';
import {ImAddRequestEntity} from './model/mongoEntity/ImAddRequestEntity';
import { FriendMessageEntity } from './model/noticePersistence/FriendMessageEntity';
import {GroupMessageEntity} from './model/noticePersistence/GroupMessageEntity';
import {FriendMessageOffLineEntity} from './model/noticePersistence/FriendMessageOffLineEntity';
import {MessageStoreModule} from './module/MessageStoreModule';
import {SystemRobotModule} from './module/SystemRobotModule';
import {RobotMessageEntity} from './model/mongoEntity/RobotMessageEntity';
import {GroupEntity} from './model/mongoEntity/GroupEntity';
import {GroupUserMapEntity} from './model/mongoEntity/GroupUserMapEntity';
import {GroupUserRoleEntity} from './model/mongoEntity/GroupUserRoleEntity';
import {ImRequestGroupEntity} from './model/mongoEntity/ImRequestGroupEntity';
import {GroupModule} from './module/GroupModule';
import {GroupReceiveMessageEntity} from './model/noticePersistence/GroupReceiveMessageEntity';
import {GroupSendMessageEntity} from './model/noticePersistence/GroupSendMessageEntity';
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
            entities: [RequestMessageEntity, UserMap, ImAddRequestEntity, RobotMessageEntity, GroupEntity, GroupUserMapEntity, GroupUserRoleEntity, ImRequestGroupEntity ],
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
              entities: [FriendMessageEntity, GroupMessageEntity, FriendMessageOffLineEntity, GroupReceiveMessageEntity, GroupSendMessageEntity],
          },
      ),
    MessageModule, EventModule, FriendModule, GroupModule, SystemRobotModule,
    AmqpMessageModule, MessageStoreModule,
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class MainModule {}

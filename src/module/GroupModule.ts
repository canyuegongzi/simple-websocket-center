import { forwardRef, HttpModule, Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GroupController} from '../controller/GroupController';
import {GroupService} from '../service/GroupService';
import {GroupEntity} from '../model/mongoEntity/GroupEntity';
import {GroupUserMapEntity} from '../model/mongoEntity/GroupUserMapEntity';
import {GroupUserRoleEntity} from '../model/mongoEntity/GroupUserRoleEntity';
import {ImRequestGroupEntity} from '../model/mongoEntity/ImRequestGroupEntity';
import {RabbitMQModule} from '@golevelup/nestjs-rabbitmq';
import {rabbitMQConfig} from '../config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity, GroupUserMapEntity, GroupUserRoleEntity, ImRequestGroupEntity] ),
    HttpModule,
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
      ],
      uri: 'amqp://root:123ADD123ADD@148.70.150.131:5179',
    }),
  ],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [],
})
export class GroupModule {}

import { forwardRef, HttpModule, Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FriendMessageEntity} from '../model/noticePersistence/friendMessage.entity';
import {MessageStoreService} from '../service/messageStore.service';
import {GroupMessageEntity} from '../model/noticePersistence/groupMessage.entity';
import {FriendMessageOffLineEntity} from '../model/noticePersistence/friendMessageOffLine.entity';
import {MessageStoreController} from '../controller/messageStore.controller';
import {FriendService} from '../service/friend.service';
import {UserMap} from '../model/mongoEntity/friend.entity';
import {ImAddRequestEntity} from '../model/mongoEntity/imAddRequest.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMap, ImAddRequestEntity], 'default' ),
    TypeOrmModule.forFeature([FriendMessageEntity, GroupMessageEntity, FriendMessageOffLineEntity], 'noticePersistence' ),
    HttpModule,
  ],
  providers: [MessageStoreService, FriendService],
  controllers: [MessageStoreController],
  exports: [],
})
export class MessageStoreModule {}

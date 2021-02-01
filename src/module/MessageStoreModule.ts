import { forwardRef, HttpModule, Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FriendMessageEntity} from '../model/noticePersistence/FriendMessageEntity';
import {MessageStoreService} from '../service/MessageStoreService';
import {GroupMessageEntity} from '../model/noticePersistence/GroupMessageEntity';
import {FriendMessageOffLineEntity} from '../model/noticePersistence/FriendMessageOffLineEntity';
import {MessageStoreController} from '../controller/MessageStoreController';
import {UserMap} from '../model/mongoEntity/FriendEntity';
import {ImAddRequestEntity} from '../model/mongoEntity/ImAddRequestEntity';
import {FriendService} from '../service/FriendService';
import {GroupUserMapEntity} from '../model/mongoEntity/GroupUserMapEntity';
import {GroupReceiveMessageEntity} from '../model/noticePersistence/GroupReceiveMessageEntity';
import {GroupSendMessageEntity} from '../model/noticePersistence/GroupSendMessageEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMap, ImAddRequestEntity, GroupUserMapEntity], 'default' ),
    TypeOrmModule.forFeature([FriendMessageEntity, GroupMessageEntity, FriendMessageOffLineEntity, GroupReceiveMessageEntity, GroupSendMessageEntity], 'noticePersistence' ),
    HttpModule,
  ],
  providers: [MessageStoreService, FriendService],
  controllers: [MessageStoreController],
  exports: [],
})
export class MessageStoreModule {}

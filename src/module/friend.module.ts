import { forwardRef, HttpModule, Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FriendController} from '../controller/friend.controller';
import {FriendService} from '../service/friend.service';
import {UserMap} from '../model/mongoEntity/friend.entity';
import {ImAddRequestEntity} from '../model/mongoEntity/imAddRequest.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMap, ImAddRequestEntity] ),
    HttpModule,
  ],
  providers: [FriendService],
  controllers: [FriendController],
  exports: [],
})
export class FriendModule {}

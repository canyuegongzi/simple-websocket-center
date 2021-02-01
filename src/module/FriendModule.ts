import { forwardRef, HttpModule, Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FriendController} from '../controller/FriendController';
import {UserMap} from '../model/mongoEntity/FriendEntity';
import {ImAddRequestEntity} from '../model/mongoEntity/ImAddRequestEntity';
import {FriendService} from '../service/FriendService';

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

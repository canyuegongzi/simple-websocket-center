import { HttpService, Injectable } from '@nestjs/common';
import {From, On} from 'nest-event';
import {InjectRepository} from '@nestjs/typeorm';
import {GroupEntity} from '../../model/mongoEntity/GroupEntity';
import {MongoRepository} from 'typeorm';
import {GroupUserMapEntity} from '../../model/mongoEntity/GroupUserMapEntity';
import {GroupUserRoleEntity} from '../../model/mongoEntity/GroupUserRoleEntity';
import {ImRequestGroupEntity} from '../../model/mongoEntity/ImRequestGroupEntity';

@Injectable()
export class MessageStoreService {
    constructor(
        @InjectRepository(GroupEntity) private readonly groupEntityRepository: MongoRepository<GroupEntity>,
        @InjectRepository(GroupUserMapEntity) private readonly groupUserMapEntityRepository: MongoRepository<GroupUserMapEntity>,
        @InjectRepository(GroupUserRoleEntity) private readonly groupUserRoleEntityRepository: MongoRepository<GroupUserRoleEntity>,
        @InjectRepository(ImRequestGroupEntity) private readonly imRequestGroupEntityRepository: MongoRepository<ImRequestGroupEntity>,
        private readonly httpService: HttpService,
    ) {}

    /**
     * 同步群信息
     */
    @From('emit-sync-group-message')
    @On('sync-group-info')
    public async changeFriendMessageStatus(message: any) {
        console.log('群信息修改');
    }
}

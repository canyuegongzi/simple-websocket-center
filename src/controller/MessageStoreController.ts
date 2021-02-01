import {Body, Controller, Get, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import { TransformInterceptor } from '../common/shared/interceptors/TransformInterceptor';
import { LoggingInterceptor } from '../common/shared/interceptors/LoggingInterceptor';
import {MessageStoreService} from '../service/MessageStoreService';
import {GetMessageQueryDto} from '../model/DTO/messageStore/GetMessageQueryDto';
import {MessageType, ResultData} from '../common/result/ResultData';
import {UserMessageQueryDto} from '../model/DTO/messageStore/UserMessageQueryDto';
import {FriendMessageEntity} from '../model/noticePersistence/FriendMessageEntity';
import {GroupMessageQueryDto} from '../model/DTO/messageStore/GroupMessageQueryDto';
import {GroupReceiveMessageEntity} from '../model/noticePersistence/GroupReceiveMessageEntity';

@Controller('messageStore')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class MessageStoreController {
  constructor(
    @Inject(MessageStoreService) private readonly messageStoreService: MessageStoreService,
  ) {}

  /**
   * 首页信息列表
   * @param params
   */
  @Get('homeMessageList')
  public async getHomeMessageList(@Query() params: GetMessageQueryDto) {
    try {
      const res: { total: number; friendData: {}; friendList: any[] } = await this.messageStoreService.getUserFriendHomeMessageList(params);
      const data = await this.messageStoreService.getUserGroupHomeMessageList(params);
      return new ResultData(MessageType.GETLIST,  {...res, ...data}, true);
    } catch (e) {
      return new ResultData(MessageType.GETLIST,  true, true);
    }
  }

  /**
   * 查询俩用户的聊天记录
   * @param params
   */
  @Get('userFriendMessage')
  public async getMessageByUserIds(@Query() params: UserMessageQueryDto) {
    try {
      const res: [FriendMessageEntity[], number] = await this.messageStoreService.getMessageByUserIds(params);
      return new ResultData(MessageType.GETLIST,  {data: res[0], total: res[1]}, false);
    } catch (e) {
      return new ResultData(MessageType.GETLIST,  true, false);
    }
  }

  /**
   * 查询群组聊天记录
   * @param params
   */
  @Get('groupMessage')
  public async getGroupMessage(@Query() params: GroupMessageQueryDto) {
    try {
      const res: [GroupReceiveMessageEntity[], number] = await this.messageStoreService.getGroupMessageList(params);
      return new ResultData(MessageType.GETLIST,  {data: res[0], total: res[1]}, false);
    } catch (e) {
      return new ResultData(MessageType.GETLIST,  true, false);
    }
  }
  // getGroupMessageList
}

import {Body, Controller, Get, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import { TransformInterceptor } from '../common/shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/shared/interceptors/logging.interceptor';
import {MessageStoreService} from '../service/messageStore.service';
import {GetMessageQueryDto} from '../model/DTO/messageStore/GetMessageQueryDto';
import {MessageType, ResultData} from '../common/result/ResultData';
import {UserMessageQueryDto} from '../model/DTO/messageStore/UserMessageQueryDto';
import {FriendMessageEntity} from '../model/noticePersistence/friendMessage.entity';

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
      const res: { total: number; data: {}; friendList: any[] } = await this.messageStoreService.getUserHomeMessageList(params);
      return new ResultData(MessageType.GETLIST,  res, true);
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
}

import { Controller, Get, Inject, Query, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from '../common/shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/shared/interceptors/logging.interceptor';
import { MessageService } from '../service/service/message.service';
import { QueryMessageDto } from '../model/DTO/message/queryMessageDto';

@Controller('message')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
// @UseGuards(RolesGuard)
export class MessageController {
  constructor(
    @Inject(MessageService) private readonly messageService: MessageService,
  ) {}

  /**
   * 获取用户列表
   */
  @Get('userList')
  public async userList() {
    try {
      const res = await this.messageService.getUserList();
      return {code: 200, data: res, message: '查询成功'};
    } catch (e) {
      return {code: 200, data: [], message: '查询失败'};
    }
  }

  /**
   * 获取消息列表
   * @param params
   */
  @Get('userMessageList')
  public async getUserMessageList(@Query() params: QueryMessageDto) {
    try {
      const res = await this.messageService.getUserMessageList(params);
      return {code: 200, data: res, message: '查询成功'};
    } catch (e) {
      return {code: 200, data: [], message: '查询失败'};
    }
  }
}

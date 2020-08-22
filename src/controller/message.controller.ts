import {Body, Controller, Get, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import { TransformInterceptor } from '../common/shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/shared/interceptors/logging.interceptor';
import { MessageService } from '../service/message.service';
import { QueryMessageDto } from '../model/DTO/message/queryMessageDto';
import {MessageUserDto} from '../model/DTO/message/message_user.dto';
import {QueryUserList} from '../model/DTO/message/query_user_list.dto';
import {CreateMessageGroupDto} from '../model/DTO/message/create_message_group.dto';
import {QueryUserMessageListDto} from '../model/DTO/message/query_user_message_list.dto';
import {MessageList} from '../utils/MessageList';
import {ApiException} from '../common/error/exceptions/api.exception';
import {ApiErrorCode} from '../config/api-error-code.enum';

@Controller('message')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
// @UseGuards(RolesGuard)
export class MessageController {
  constructor(
    @Inject(MessageService) private readonly messageService: MessageService,
  ) {}

  /**
   * 获取全部用户列表
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

  /**
   * 添加用户
   * @param params
   */
  @Post('addMessageUser')
  public async addMessageUser(@Body() params: MessageUserDto) {
    try {
      const res = await this.messageService.addMessageUser(params);
      return {code: 200, data: res, message: '操作成功'};
    } catch (e) {
      return {code: 200, data: [], message: '操作失败'};
    }
  }

  /**
   * 添加群组
   * @param params
   */
  @Post('addMessageGroup')
  public async addMessageGroup(@Body() params: CreateMessageGroupDto) {
    try {

    } catch (e) {
      return {code: 200, data: [], message: '操作失败'};
    }
  }

  /**
   * 获取用户列表（登录用户）
   * @param params
   */
  @Get('messageRoomUserList')
  public async messageRoomUserList(@Query() params: QueryUserList) {
    try {
     try {
       const res = await this.messageService.queryUserInfo(params);
       // @ts-ignore
       const friends = res.friends.split('，');
       try {
         const friendsLine = await this.messageService.queryManyUserFriends(friends);
         return {code: 200, data: friendsLine, success: true, message: '查询成功'};
       } catch (e) {
         return {code: 200, data: [], success: false, message: '查询失败'};
       }
     } catch (e) {
       return {code: 200, data: [], success: false, message: '查询失败'};
     }
    } catch (e) {
      return {code: 200, data: [], success: false, message: '查询失败'};
    }
  }

  /**
   * 获取群组（登录用户）
   * @param params
   */
  @Get('messageRoomUserList')
  public async messageRoomGroupsList(@Query() params: QueryUserList) {
    try {
      return {code: 200, data: [], message: '查询成功'};
    } catch (e) {
      return {code: 200, data: [], message: '查询失败'};
    }
  }

  /**
   * 聊天记录）
   * @param params
   */
  @Get('friendMessageAll')
  public async friendMessageAll(@Query() params: QueryUserMessageListDto) {
    try {
      const res = await this.messageService.queryUserMessageListAll(params);
      return {code: 200, data: res, message: '查询成功'};
    } catch (e) {
      return {code: 200, data: [], message: '查询失败'};
    }
  }

  /**
   * 获取给特定用户的消息
   * @param params
   */
  @Get('messageByToUser')
  public async querymessageByToUser(@Query() params: QueryUserMessageListDto) {
    try {
      const res = await this.messageService.messageByToUser(params);
      const  {dest, froms } = MessageList.dealMessageByToUser(res);
      const list = [];
      let userList;
      try {
        const ress = await this.messageService.findUserInfo(froms);
        userList = ress.data && ress.data.data ? ress.data.data.data : [];
      } catch (e) {
        userList = [];
      }
      dest.forEach((item, index) => {
        const user = userList.find(item1 => item1.id == item.from);
        list.push({
          from: item.from,
          fromUserInfo: {
            name: user ? user.name : '',
            id: user ? user.id : item.from,
            nick: user ? user.nick : '',
          },
          data: item.data[item.data.length - 1],
        });
      });
      return {code: 200, data: list, message: '查询成功'};
    } catch (e) {
      return {code: 200, data: [], message: '查询失败'};
    }
  }
}

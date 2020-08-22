import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import { Inject } from '@nestjs/common';
import { MessageService } from '../../service/message.service';
import { CreatLineDto } from '../../model/DTO/line/create_line.dto';
import { UpdateLineDto } from '../../model/DTO/line/update_line.dto';
import {ApiException} from '../error/exceptions/api.exception';
import {ApiErrorCode} from '../../config/api-error-code.enum';

@WebSocketGateway(9006 )
export class ChatsGateway {
  @WebSocketServer()
  server: Server;
  constructor(@Inject(MessageService) private readonly messageService: MessageService) {}
  /**
   * 用户连接
   * @param client
   * @param userId
   */
  @SubscribeMessage('userConnect')
  async connect(client, message: CreatLineDto): Promise<any> {
    try {
       let userStatusList: any;
       try {
         userStatusList = await this.messageService.findUserStatus(message.userId);
       } catch (e) {
         userStatusList = [];
         throw new ApiException(e.errorMessage, ApiErrorCode.USER_LIST_FILED, 200);
       }
       try {
        if (userStatusList.length > 1) {
          await this.messageService.deleteUser(Array.isArray(message.userId) ? message.userId : [ message.userId ]);
        }
       } catch (e) {
          throw new ApiException(e.errorMessage, ApiErrorCode.USER_LIST_FILED, 200);
       }
       try {
          const res = await this.messageService.userOnline(message, client.id);
          return { message: '操作成功', data: res, success: true};
       } catch (e) {
          throw new ApiException(e.errorMessage, ApiErrorCode.USER_LIST_FILED, 200);
       }
       this.server.emit('broadcastLine', { user: userStatusList});
    } catch (e) {
      return { message: '操作成功', err: e, success: false};
    }

  }
  /**
   * 用户下线
   * @param client
   * @param userId
   */
  @SubscribeMessage('userOutConnect')
  async outConnect(client, message: UpdateLineDto): Promise<any> {
    try {
      await this.messageService.userOutLine(message);
      try {
        client.broadcast.emit('broadcastOutLine', {userId: message.userId, message: '该用户退出系统'});
      } catch (e) {
        throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
      }
      return { message: '操作成功', success: true};
    } catch (e) {
      return { message: '操作失败', success: false};
    }
  }

  /**
   * 接收消息
   * @param client
   * @param userId
   */
  @SubscribeMessage('sendMessage')
  async getMessage(client, message: any): Promise<any> {
    try {
      const user: any = await this.messageService.getUser(message.to);
      let userLink: any = [];
      try {
          userLink = await this.messageService.findUserInfo([message.from]);
      } catch (e) {
          userLink = [];
      }
      const userData = userLink.data && userLink.data.data && userLink.data.data.data ? userLink.data.data.data : [];
      if (user && user[0].status) {
        try {
          this.server.to(user[0].wsId).emit('getMessage',  {message, user: userData ? userData[0] : {}});
          client.emit('successMessage', {success: true, message: '发送成功'});
        } catch (e) {
          throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
      } else {
        client.emit('successMessage', {success: false, message: '用户不在线'});
      }
      try {
        await this.messageService.saveMessage(message);
      } catch (e) {
        throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
      }
      return { message: '操作成功', success: true};
    } catch (e) {
      return { message: e.errorMessage, success: false};
    }

  }
}

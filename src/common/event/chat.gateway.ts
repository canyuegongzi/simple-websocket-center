import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import { Inject } from '@nestjs/common';
import { MessageService } from '../../service/service/message.service';
import { CreatLineDto } from '../../model/DTO/line/create_line.dto';
import { UpdateLineDto } from '../../model/DTO/line/update_line.dto';
import { CreatMessageDto } from '../../model/DTO/message/create_message.dto';

@WebSocketGateway(9001 )
export class ChatsGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    @Inject(MessageService) private readonly messageService: MessageService,
  ) {}
  /**
   * 用户连接
   * @param client
   * @param userId
   */
  @SubscribeMessage('userConnect')
  async connect(client, message: CreatLineDto): Promise<any> {
    try {
       const userStatus = await this.messageService.findUserStatus(message.userId);
       if (userStatus.data.length) {
         const del = await this.messageService.deleteUser(message.userId);
       }
       const res = await this.messageService.userOnline(message, client.id);
       client.emit('successLine', res);
       this.server.emit('broadcastLine', res);
    } catch (e) {
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
      const del = await this.messageService.userOutLine(message);
      client.broadcast.emit('broadcastOutLine', {userId: message.userId, message: '该用户退出系统'});
    } catch (e) {
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
      const user = await this.messageService.getUser(message.to);
      if (user && user.data[0].status) {
        this.server.to(user.data[0].wsId).emit('getMessage',  {message});
        client.emit('successMessage', {success: true, message: '发送成功'});
      } else {
        client.emit('successMessage', {success: false, message: '用户不在线'});
      }
      // tslint:disable-next-line:max-line-length
      const temp = { content: message.message, type: message.type || 1, to: message.to, from: message.from, time: new Date(), user: message.from, operate: '', status: 0 };
      const res = await this.messageService.saveMessage(temp);
    } catch (e) {
    }

  }
}

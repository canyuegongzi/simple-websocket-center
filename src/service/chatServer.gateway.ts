import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Inject } from '@nestjs/common';
import {MessageService} from './message.service';

@WebSocketGateway(9010 )
export class ChatServerGateway {
    @WebSocketServer()
    server: Server;
    constructor(@Inject(MessageService) private readonly messageService: MessageService) {
        console.log('消息服務啟動成功');
    }
}

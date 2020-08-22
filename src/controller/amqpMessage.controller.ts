import {Body, Controller, Get, Headers, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import moment = require('moment');
import {AmqpMessageProductService} from '../service/amqpMessageProduct.service';
import {AmqpMessageDto} from '../model/DTO/message/AmqpMessageDto';
import {MessageType, ResultData} from '../common/result/ResultData';
moment.locale('zh-cn');

@Controller('amqpMessage')
export class AmqpMessageController {
    constructor(
        @Inject(AmqpMessageProductService) private readonly amqpMessageProductService: AmqpMessageProductService,
    ) {
        console.log(225);
    }

    @Post('newFriendMessage')
    public async amqpEmitFriendNewTask(@Body() amqpMessageDto: AmqpMessageDto): Promise<ResultData> {
        try {
            await this.amqpMessageProductService.sendFriendMessage(amqpMessageDto);
            return new ResultData(MessageType.OPERATE,  true, true);
        } catch (e) {
            return new ResultData(MessageType.OPERATE,  false, false);
        }
    }

    @Post('newGroupMessage')
    public async amqpEmitGroupNewTask(@Body() amqpMessageDto: AmqpMessageDto): Promise<ResultData> {
        try {
            await this.amqpMessageProductService.sendGroupMessage(amqpMessageDto);
            return new ResultData(MessageType.OPERATE,  true, true);
        } catch (e) {
            return new ResultData(MessageType.OPERATE,  false, false);
        }
    }
}

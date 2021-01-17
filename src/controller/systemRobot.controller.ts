import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {SystemRobotService} from '../service/systemRobot.service';
import {QueryRobotDto} from '../model/DTO/robot/query_robot.dto';
import {UserMessageQueryDto} from '../model/DTO/messageStore/UserMessageQueryDto';
import {FriendMessageEntity} from '../model/noticePersistence/friendMessage.entity';
import {MessageType, ResultData} from '../common/result/ResultData';
import {SystemRobotMessageStoreService} from '../service/systemRobotMessageStore.service';

@Controller('robot')
export class SystemRobotController {
    constructor(
        private readonly systemRobotService: SystemRobotService,
        private readonly systemRobotMessageStoreService: SystemRobotMessageStoreService,
        ) {}

    /**
     * 聊天记录）
     * @param params
     */
    @Post('queryAnswer')
    public async friendMessageAll(@Body() query: QueryRobotDto) {
        try {
            const res = await this.systemRobotService.getChitchatMessage(query, query.content, query.multiWheel, query.otherQuery);
            return {code: 200, data: res, message: '查询成功'};
        } catch (e) {
            return {code: 200, data: [], message: '查询失败'};
        }
    }

    /**
     * 查询俩用户的聊天记录
     * @param params
     */
    @Get('userFriendMessage')
    public async getMessageByUserIds(@Query() params: UserMessageQueryDto) {
        try {
            const res: [FriendMessageEntity[], number] = await this.systemRobotMessageStoreService.getMessageByUserIds(params);
            return new ResultData(MessageType.GETLIST,  {data: res[0], total: res[1]}, false);
        } catch (e) {
            return new ResultData(MessageType.GETLIST,  true, false);
        }
    }
}

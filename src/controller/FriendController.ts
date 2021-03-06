import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {MessageType, ResultData} from '../common/result/ResultData';
import {UserMap} from '../model/mongoEntity/FriendEntity';
import {ApiException} from '../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../config/ApiErrorCodeEnum';
import {RequestAddFriendDto} from '../model/DTO/friend/RequestAddFriend.dto';
import {RequestCallBackDto} from '../model/DTO/common/RequestCallBack.dto';
import {FriendService} from '../service/FriendService';

@Controller('friend')
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

    @Get('/list')
    public async getFriends(@Query('userId') userId: string) {
        try {
            const res: [UserMap[], number] = await this.friendService.getFriends(userId);
            return new ResultData(MessageType.OPERATE,  {data: res[0], total: res[1]}, true);
        } catch (e) {
            console.log(e);
            return new ResultData(MessageType.OPERATE,  true, true);
        }

    }

    /**
     * 请求好友
     * @param params
     */
    @Post('/request')
    public async requestAddFriend(@Body() params: RequestAddFriendDto) {
        try {
            await this.friendService.requestAddFriend(params);
            return new ResultData(MessageType.OPERATE,  true, true);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 请求反馈
     * @param params
     */
    @Post('/requestCallback')
    public async callbackRequest(@Body() params: RequestCallBackDto) {
        try {
            await this.friendService.callbackRequest(params);
            return new ResultData(MessageType.OPERATE,  true, true);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 请求好友列表
     * @param params
     */
    @Post('/requestList')
    public async requestAddFriendList(@Body('userId') userId: any) {
        try {
            const list: any = await this.friendService.requestAddFriendList(userId);
            return new ResultData(MessageType.GETLIST,  list, true);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 请求好友列表
     * @param params
     */
    @Post('/myRequest')
    public async getMyRequest(@Body('userId') userId: string) {
        try {
            const res: any = await this.friendService.getMyRequest(userId);
            return new ResultData(MessageType.GETLIST,  {data: res[0], total: res[1]}, true);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 请求好友列表
     * @param params
     */
    @Post('/friendRequest')
    public async getFriendRequest(@Body('userId') targetId: string) {
        try {
            const res: any = await this.friendService.getFriendRequest(targetId.toString());
            return new ResultData(MessageType.GETLIST,  {data: res[0], total: res[1]}, true);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 初始化机器人联系人
     */
    @Post('getRobotUser')
    public async initRobotUser(@Body('userId') userId: string, @Body('userName') userName: string) {
        try {
            const res: any = await this.friendService.initRobotUser(userId, userName);
            return new ResultData(MessageType.GETLIST,  res, true);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }
}

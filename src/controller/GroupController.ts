import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {MessageType, ResultData} from '../common/result/ResultData';
import {ApiException} from '../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../config/ApiErrorCodeEnum';
import {GroupService} from '../service/GroupService';
import {RequestAddGroupDto} from '../model/DTO/group/RequestAddGroup.dto';
import {RequestUpdateGroupDto} from '../model/DTO/group/RequestUpdateGroup.dto';
import {RequestAddUserToGroupDto} from '../model/DTO/group/RequestAddUserToGroup.dto';
import {RequestGroupCallBackDto} from '../model/DTO/group/RequestGroupCallBack.dto';
import {GroupQueryDto} from '../model/DTO/group/GroupQueryDto';

@Controller('group')
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    /**
     * 群组列表
     * @param userId
     */
    @Get('/list')
    public async getList(@Query('userId') userId: string) {
        try {
            const res: any = await this.groupService.getList(userId);
            return new ResultData(MessageType.OPERATE,  res, true);
        } catch (e) {
            console.log(e);
            return new ResultData(MessageType.OPERATE,  true, true);
        }

    }

    /**
     * 群组列表
     * @param params
     */
    @Get('/queryList')
    public async getQueryList(@Query() params: GroupQueryDto) {
        try {
            const res: any = await this.groupService.getQueryList(params);
            return new ResultData(MessageType.OPERATE,  res, true);
        } catch (e) {
            console.log(e);
            return new ResultData(MessageType.OPERATE,  true, true);
        }

    }

    /**
     * 创建群组
     * @param params
     */
    @Post('/create')
    public async createGroup(@Body() params: RequestAddGroupDto) {
        try {
            const res: any = await this.groupService.createGroup(params);
            return new ResultData(MessageType.CREATE,  res.ops, true);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 更新群组
     * @param params
     */
    @Post('/update')
    public async updateGroup(@Body() params: RequestUpdateGroupDto) {
        try {
            await this.groupService.updateGroup(params);
            return new ResultData(MessageType.UPDATE,  true, true);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 删除群组
     * @param params
     */
    @Post('/delete')
    public async deleteGroup(@Body('id') groupId: string) {
        try {
            await this.groupService.deleteGroup(groupId);
            return new ResultData(MessageType.DELETE,  true, true);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 获取群组信息
     * @param params
     */
    @Get('/info')
    public async getGroupInfo(@Query('id') groupId: string) {
        try {
            const info: any[] = await this.groupService.getGroupInfo(groupId);
            return new ResultData(MessageType.GETINFO,  info.length ? info[0] : null, true);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 请求加入群组
     * @param params
     */
    @Post('/request')
    public async requestAddFriendToGroup(@Body() params: RequestAddUserToGroupDto) {
        try {
            await this.groupService.requestAddFriendToGroup(params);
            return new ResultData(MessageType.OPERATE,  true, true);
        } catch (e) {
            console.log(e);
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 管理员或者群主操作加入群组反馈
     * @param params
     */
    @Post('/requestCallback')
    public async callbackRequest(@Body() params: RequestGroupCallBackDto) {
        try {
            await this.groupService.callbackRequest(params);
            return new ResultData(MessageType.OPERATE,  true, true);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 添加请求列表
     * @param userId
     */
    @Get('/requestList')
    public async getRequestList(@Query('userId') userId: string) {
        try {
            const res: any = await this.groupService.getList(userId);
            return new ResultData(MessageType.OPERATE,  {data: res[0], total: res[1]}, true);
        } catch (e) {
            console.log(e);
            return new ResultData(MessageType.OPERATE,  true, true);
        }

    }

}

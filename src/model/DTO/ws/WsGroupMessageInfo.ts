import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

/**
 * 群消息
 */
export class WsGroupMessageInfo {
    @IsNotEmpty({ message: '消息类型不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    type?: string;

    @IsNotEmpty({ message: '消息类容不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    content?: string;

    @IsNotEmpty({ message: '消息对象群不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    groupCode?: string;

    @IsNotEmpty({ message: '消息发出者不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    userId?: string;

    @IsNotEmpty({ message: '消息对象id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    targetIds: string;

    createTime?: number;

    hashId?: string;

    status?: string;
}

import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

/**
 * 好友消息
 */
export class WsFriendMessageInfo {
    @IsNotEmpty({ message: '消息类型不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    type?: string;

    @IsNotEmpty({ message: '消息内容不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    content?: string;

    @IsNotEmpty({ message: '消息对象不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    friendId?: number | string;

    @IsNotEmpty({ message: '消息发出者不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    userId?: number | string;

    time?: number | string;

    hashId?: string;

    status?: string;

}

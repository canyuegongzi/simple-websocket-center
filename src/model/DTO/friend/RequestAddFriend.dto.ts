import {IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/ApiErrorCodeEnum';
import {Column} from 'typeorm';

export class RequestAddFriendDto {
    id?: number;

    @IsNotEmpty({ message: '目标id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    targetId: string;

    @IsNotEmpty({ message: '目标name不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    targetName: string;

    @IsNotEmpty({ message: '目标图标不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    targetIcon: string;

    @IsNotEmpty({ message: '请求来源id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    formId: string;

    @IsNotEmpty({ message: '请求来源name不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    formName: string;

    @IsNotEmpty({ message: '请求来源头像不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    formIcon: string;

    @IsNotEmpty({ message: '请求类型不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    type: string;

    note: string;

    state: boolean;

    callBackType: number;

    createTime: number; // 创建时间

    updateTime: number; // 更新时间
}

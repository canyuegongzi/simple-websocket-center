import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

export class UserMessageQueryDto {
    @IsNotEmpty({ message: 'userId不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    userId?: any;

    @IsNotEmpty({ message: 'friendId不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    friendId: any;

    @IsNotEmpty({ message: 'page不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    page: number;

    @IsNotEmpty({ message: 'pageSize不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    pageSize: number;
}

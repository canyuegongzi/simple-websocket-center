import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

export class MessageUserDto {
    id: any;

    @IsNotEmpty({ message: 'userId不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    userId: any;

    status: number;

    @IsNotEmpty({ message: 'userName不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    userName: string;
    friends: string;
    groups: string;
    createTime: number;
}

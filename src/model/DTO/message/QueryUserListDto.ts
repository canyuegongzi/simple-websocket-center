import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

export class QueryUserList {
    @IsNotEmpty({ message: 'userId不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    userId: any;
    status: number;
    userName: string;
    friends: string;
    groups: string;
    createTime: number;
}

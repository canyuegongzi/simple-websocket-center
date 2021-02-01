import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

export class QueryUserMessageListDto {
    @IsNotEmpty({ message: 'userId不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    userId: any;
    fromId: any;
    status: number;
    userName: string;
    minTime: number;
    maxTime: number;
}

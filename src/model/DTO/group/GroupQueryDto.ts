import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

export class GroupQueryDto {

    @IsNotEmpty({ message: 'page不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    page: number;

    @IsNotEmpty({ message: 'pageSize不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    pageSize: number;

    groupName: string;

    groupCode: string;
}

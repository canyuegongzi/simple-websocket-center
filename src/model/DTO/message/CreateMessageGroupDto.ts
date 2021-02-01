import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

export class CreateMessageGroupDto {
    id?: string;

    @IsNotEmpty({ message: 'userId不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    userId: number;

    status: number = 1;

    @IsNotEmpty({ message: 'name不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    name: string;

    address: string;

    person: string;

    icon: string;
    createTime: number = new Date().getTime();
}

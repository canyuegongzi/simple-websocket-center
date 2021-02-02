import {IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/ApiErrorCodeEnum';
import {ImRequestGroupEntity} from '../../mongoEntity/ImRequestGroupEntity';

export class RequestAddUserToGroupDto extends ImRequestGroupEntity {
    id: any;

    @IsNotEmpty({ message: '用户id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    userId: string;

    @IsNotEmpty({ message: '用户name', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    userName: string;

    @IsNotEmpty({ message: '群name不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    groupName: string;

    @IsNotEmpty({ message: '群code不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    groupCode: string;

    state: boolean;

    note: string;

    callBackType: number;

}

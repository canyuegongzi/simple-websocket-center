import {IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/ApiErrorCodeEnum';
import {GroupEntity} from '../../mongoEntity/GroupEntity';

export class RequestUpdateGroupDto extends GroupEntity {
    @IsNotEmpty({ message: '群id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    id: any;

    @IsNotEmpty({ message: '群主code不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    groupCode: string;

    groupName: string;

    groupIcon: string;

    groupDesc: string;

    rootId: string;

    rootName: string;

}

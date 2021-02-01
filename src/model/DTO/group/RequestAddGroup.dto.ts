import {IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/ApiErrorCodeEnum';
import {GroupEntity} from '../../mongoEntity/GroupEntity';

export class RequestAddGroupDto extends GroupEntity {
    id: any;

    @IsNotEmpty({ message: '群名不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    groupName: string;

    @IsNotEmpty({ message: '群主id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    rootId: string;

    @IsNotEmpty({ message: '群主名不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    rootName: string;

    groupCode: string;

    rootIcon: string;

    groupIcon: string;

    groupDesc: string;

}

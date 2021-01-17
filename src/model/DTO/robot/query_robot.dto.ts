import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/api-error-code.enum';

export class QueryRobotDto {
    @IsNotEmpty({ message: '问句不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    content: string;

    @IsNotEmpty({ message: '目标id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    targetId: string;

    @IsNotEmpty({ message: '用戶id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    userId: string;

    multiWheel: boolean = false;

    otherQuery: object = {
        logId: null,
        botSession: '',
    };
}

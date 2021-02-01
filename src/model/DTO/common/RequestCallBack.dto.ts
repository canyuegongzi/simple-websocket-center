import {IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/ApiErrorCodeEnum';

export class RequestCallBackDto {
    @IsNotEmpty({ message: 'id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    id?: string;

    @IsNotEmpty({ message: '反馈结果不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    callBackType: number; // 1 未应答 2： 同意  3： 不同意
}

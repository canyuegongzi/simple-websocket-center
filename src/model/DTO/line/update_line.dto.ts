import {IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class UpdateLineDto {
  @IsNotEmpty({ message: '用户id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
  userId: any;
  address: string;
  ip: string;
}

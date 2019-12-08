import {IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class CreatLineDto {
  @IsNotEmpty({ message: '用户id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
  userId: any;
  address: string;
  userName: string;
  ip: string;
  status: number;
  @IsNotEmpty({ message: 'socketid不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
  wsId: string;
}

export class CreatMessageDto {
  content: string;
  type: string;
  to: string;
  from: string;
  time: any;
  user: string;
  operate: string;
  // 消息状态
  status: number;
}

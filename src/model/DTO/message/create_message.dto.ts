export class CreatMessageDto {
  content: string;
  type: number;
  to: string;
  from: string;
  time: Date;
  user: string;
  operate: string;
  // 消息状态
  status: number;
}

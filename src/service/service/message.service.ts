import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../../interface/message.chart.interface';
import { Type } from '../../interface/type.chart.interface';
import { Line } from '../../interface/line.chart.interface';
import { CreatLineDto } from '../../model/DTO/line/create_line.dto';
import { UpdateLineDto } from '../../model/DTO/line/update_line.dto';
import { httpUrl } from '../../config/config';
import { CreatMessageDto } from '../../model/DTO/message/create_message.dto';
import { QueryMessageDto } from '../../model/DTO/message/queryMessageDto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    @InjectModel('Type') private readonly typeModel: Model<Type>,
    @InjectModel('Line') private readonly lineModel: Model<Line>,
    private readonly httpService: HttpService,
  ) {}

  /**
   * 用户上线
   */
  async userOnline(line: CreatLineDto, wsId: string) {
    const currentUser = await this.httpService
      .get(`${httpUrl.userApi}/user/getUserInfo?id=${line.userId}`)
      .toPromise();
    const obj = new CreatLineDto();
    obj.userId = line.userId;
    obj.wsId = wsId;
    obj.address = line.address || '';
    obj.status = 1;
    obj.userName = currentUser.data.data.data.name;
    obj.ip = line.ip || '';
    const createdLine = new this.lineModel(obj);
    try {
      const res = await createdLine.save();
      return { success: true, data: res, message: 'success' };
    } catch (e) {
      return { success: false, data: null, message: 'fail' };
    }
  }

  /**
   * 用户下线
   */
  async userOutLine(line: UpdateLineDto) {
    const where = { userId: line.userId };
    const update = { $set: { status: 0 } };
    try {
      const res = await this.lineModel.updateOne(where, update);
      return { success: true, data: res, message: 'success' };
    } catch (e) {
      return { success: true, data: null, message: 'fail' };
    }
  }

  /**
   * 用户状态
   * @param userId
   */
  async findUserStatus(userId: string) {
    try {
      const res = await this.lineModel.find({ userId }).exec();
      return { success: true, data: res, message: 'success' };
    } catch (e) {
      return { success: true, data: null, message: 'fail' };
    }
  }

  /**
   * 移除状态
   * @param userId
   */
  async deleteUser(userId: string) {
    return this.lineModel.deleteOne({ userId });
  }

  /**
   * 查询用户列表
   */
  async getUserList() {
    try {
      const res = await this.lineModel.find();
      return { success: true, data: res, message: '查询成功' };
    } catch (e) {
      return { success: true, data: [], message: '查询失败' };
    }
  }

  /**
   * 查询用户的消息列表
   */
  async getUserMessageList(query: QueryMessageDto) {
    console.log(query);
    try {
      const res = await this.messageModel
        .where('to', query.to)
        .exec();
      return { success: true, data: res, message: '查询成功' };
    } catch (e) {
      return { success: true, data: [], message: '查询失败' };
    }
  }
  /**
   * 查询用户
   */
  async getUser(userId: string) {
    try {
      const res = await this.lineModel.find({ userId }).exec();
      return { success: true, data: res, message: '查询成功' };
    } catch (e) {
      return { success: true, data: [], message: '查询失败' };
    }
  }

  /**
   * 保存消息
   * @param message
   */
  async saveMessage(message: CreatMessageDto) {
    const obj = new CreatMessageDto();
    obj.content = message.content;
    obj.type = message.type;
    obj.to = message.to;
    obj.from = message.from;
    obj.time = new Date();
    obj.user = message.from;
    obj.operate = '';
    obj.status = 0;
    const createdMessage = new this.messageModel(obj);
    try {
      const res = await createdMessage.save();
      return { success: true, data: res, message: 'success' };
    } catch (e) {
      return { success: false, data: null, message: 'fail' };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from '../model/entity/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../interface/message.chart.interface';
import { Type } from '../interface/type.chart.interface';
import { Line } from '../interface/line.chart.interface';
import { CreatLineDto } from '../model/DTO/line/create_line.dto';

@Injectable()
export class InitService {
  constructor(
    // @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    @InjectModel('Type') private readonly typeModel: Model<Type>,
    @InjectModel('Line') private readonly lineModel: Model<Line>,
  ) {}

  /**
   * 系统初始化
   * @param cat
   */
  async sysInit(line: CreatLineDto): Promise < Line > {
    const createdLine = new this.lineModel(line)
    return await createdLine.save();
  }
}

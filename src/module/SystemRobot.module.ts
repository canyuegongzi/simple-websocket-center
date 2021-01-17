import { forwardRef, HttpModule, Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SystemRobotService} from '../service/systemRobot.service';
import {SystemRobotController} from '../controller/systemRobot.controller';
import {RobotMessageEntity} from '../model/mongoEntity/robotMessage.entity';
import {SystemRobotMessageStoreService} from '../service/systemRobotMessageStore.service';
import {UtilService} from '../service/util.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RobotMessageEntity] ),
    HttpModule,
  ],
  providers: [SystemRobotService, SystemRobotMessageStoreService, UtilService],
  controllers: [SystemRobotController],
  exports: [],
})
export class SystemRobotModule {}

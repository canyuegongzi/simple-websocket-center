import { forwardRef, HttpModule, Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SystemRobotService} from '../service/SystemRobotService';
import {SystemRobotController} from '../controller/SystemRobotController';
import {RobotMessageEntity} from '../model/mongoEntity/RobotMessageEntity';
import {SystemRobotMessageStoreService} from '../service/SystemRobotMessageStore.service';
import {UtilService} from '../service/UtilService';

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

import { Module } from '@nestjs/common';
import { RedisModule} from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {join} from 'path';
import { MessageModule } from './module/message.module';
import { MessageGroupEntity} from './model/mongoEntity/messageGroup.entity';
import { LineEntity} from './model/mongoEntity/line.entity';
import {MessageEntity} from './model/mongoEntity/message.entity';
import {MessageUserEntity} from './model/mongoEntity/messageUser.entity';
import {RequestMessageEntity} from './model/mongoEntity/requestMessage.entity';
import {TypeEntity} from './model/mongoEntity/type.entity';
import {AmqpMessageModule} from './module/amqpMessage.module';
@Module({
  imports: [
    // RedisModule.register(redisConfig),
    TypeOrmModule.forRoot(
        {
            name: 'default',
            type: 'mongodb',
            host: '127.0.0.1',
            port: 27017,
            useNewUrlParser: true,
            database: 'simple_message_center',
            synchronize: true,
            entities: [LineEntity, MessageEntity, MessageGroupEntity, MessageUserEntity, RequestMessageEntity, TypeEntity ],
        },
    ),
      /*MongooseModule.forRoot('mongodb://localhost', {
          name: 'mongoCon',
          port: 27017,
          useNewUrlParser: true,
          database: 'simple_message_center',
          synchronize: true,
      }),*/
    TypeOrmModule.forRoot(
        {
          type: 'mysql',
          name: 'mysqlCon',
          host: '127.0.0.1',
          port: 3306,
          username: 'root',
          password: '123456',
          database: 'b_simple_message_center',
          entities: [join(__dirname, '**/entity/**.entity{.ts,.js}')],
          synchronize: true,
        },
    ),
    MessageModule,
    AmqpMessageModule,
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class MainModule {}

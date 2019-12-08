import { Module } from '@nestjs/common';
import { RedisModule} from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoDbConfig, redisConfig } from './config/config';
import {ConfigModule} from './module/config.module';
import {join} from 'path';
import { MessageModule } from './module/message.module';

@Module({
  imports: [
    // RedisModule.register(redisConfig),
    MongooseModule.forRoot(mongoDbConfig.url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }),
    TypeOrmModule.forRoot(
        {
          type: 'mysql',
          host: '127.0.0.1',
          port: 3306,
          username: 'root',
          password: '123456',
          database: 'b_simple_message_center',
          entities: [join(__dirname, '**/**.entity{.ts,.js}')],
          synchronize: true,
        },
    ),
    MessageModule,
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class MainModule {}

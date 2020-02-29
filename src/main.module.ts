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
    TypeOrmModule.forRoot(
        {
            name: 'mongoCon',
            type: 'mongodb',
            host: '127.0.0.1',
            port: 27017,
            useNewUrlParser: true,
            database: 'simple_message_center',
            synchronize: true,
            entities: [join(__dirname, '**/mongoEntity/**.entity{.ts,.js}')],
        },
    ),
    TypeOrmModule.forRoot(
        {
          type: 'mysql',
          name: 'mysqlCon',
          host: '127.0.0.1',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'b_simple_message_center',
          entities: [join(__dirname, '**/entity/**.entity{.ts,.js}')],
          synchronize: true,
        },
    ),
    MessageModule,
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class MainModule {}

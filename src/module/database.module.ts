import { Module } from '@nestjs/common';
// @ts-ignore
import { databaseProviders } from '../database/database.providers';
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}

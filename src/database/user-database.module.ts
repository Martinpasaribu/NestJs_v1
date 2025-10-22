import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('USER_DB_URI'),
        connectionName: 'users',
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class UserDatabaseModule {}

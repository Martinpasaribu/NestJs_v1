import { Module, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { AppController } from './app.controller';
import { BlogModule } from './blog/blog.module';
// import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisProvider } from './config/redis.provider';
import { AuthorModule } from './author/author.module';
import { OrdersModule } from './orders/orders.module';
import { VisitorModule } from './visitor/visitor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    BlogModule,
    AuthorModule,
    OrdersModule,
    VisitorModule
    // RedisModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     url: config.get<string>('REDIS_URL'), // Gunakan 'url' BUKAN 'uri'
    //     type: 'single', // opsional, kalau kamu yakin Redis-mu single instance
    //   }),
    // }),
  ],
  providers: [RedisProvider],
  exports: [RedisProvider],
  
  controllers: [AppController],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger('MongoDB');

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onApplicationBootstrap() {
    // Tunggu sebentar agar event listener terpasang setelah koneksi dibuka
    setTimeout(() => {
      this.connection.on('connected', () => {
        this.logger.log('✅ MongoDB terhubung');
      });

      this.connection.on('disconnected', () => {
        this.logger.warn('⚠️ MongoDB terputus');
      });

      this.connection.on('error', (err) => {
        this.logger.error(`❌ MongoDB error: ${err}`);
      });

      // Jika sudah terkoneksi saat ini
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (this.connection.readyState === 1) {
        this.logger.log('✅ MongoDB sudah terhubung saat init');
        this.logger.log(`📂 Database: ${this.connection.name}`);
      }
    }, 100); // 100 ms delay cukup aman
  }
}

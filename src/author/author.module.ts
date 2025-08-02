/* eslint-disable @typescript-eslint/no-unused-vars */
// src/blog/blog.module.ts
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // ✅ Tambahkan ini
import { RedisProvider } from 'src/config/redis.provider';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { Author, AuthorSchema } from './schemas/author-schema';
import { RateLimitMiddleware } from 'src/common/middleware/rate-limit.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Author.name, schema: AuthorSchema }, // ✅ Daftarkan model
    ]),
  ],
  controllers: [AuthorController],
  providers: [AuthorService, RedisProvider],
})

// export class AuthorModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(RateLimitMiddleware)
//       // .forRoutes({ path: '/author', method: RequestMethod.ALL });
//   }
// }

export class AuthorModule {}
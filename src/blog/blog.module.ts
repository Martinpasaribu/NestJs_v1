/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
// src/blog/blog.module.ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Blog, BlogSchema } from './schemas/blog-schema';
import { Author, AuthorSchema } from 'src/author/schemas/author-schema';
import { RedisProvider } from 'src/config/redis.provider';
import { RateLimitMiddleware } from 'src/common/middleware/rate-limit.middleware'; // ✅ Pastikan path sesuai

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService, RedisProvider],
})

export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({ path: 'api/v1/blogs', method: RequestMethod.ALL });
  }
}

// src/blog/blog.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // ✅ Tambahkan ini
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Blog, BlogSchema } from './schemas/blog-schema'; // ✅ Pastikan path sesuai
import { RedisProvider } from 'src/config/redis.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema }, // ✅ Daftarkan model
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService, RedisProvider],
})
export class BlogModule {}

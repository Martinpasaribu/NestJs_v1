// src/blog/blog.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // ✅ Tambahkan ini
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Blog, BlogDocument } from './schemas/blog-schema'; // ✅ Pastikan path sesuai

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogDocument }, // ✅ Daftarkan model
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}

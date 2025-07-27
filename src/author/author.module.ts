// src/blog/blog.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // ✅ Tambahkan ini
import { RedisProvider } from 'src/config/redis.provider';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { Author, AuthorSchema } from './schemas/author-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Author.name, schema: AuthorSchema }, // ✅ Daftarkan model
    ]),
  ],
  controllers: [AuthorController],
  providers: [AuthorService, RedisProvider],
})
export class AuthorModule {}

import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { Author } from './schemas/author-schema';

@ApiTags('Author')
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post('/add')
  @ApiOperation({ summary: 'Add new author' })
  async addAuthor(@Body('author') author: Author) {
    return this.authorService.createAuthor(author);
  }
}

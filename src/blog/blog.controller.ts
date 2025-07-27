/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Param, Put, Delete, Query, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Blog } from './schemas/blog-schema';

@ApiTags('Blog')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua blog dengan pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.blogService.getAllBlogs(Number(page), Number(limit));
  }

  @Get('/category/:category/blogs')
  getBlogsByCategoryParam(
    @Param('category') category: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.blogService.findByCategory(category, +page, +limit);
  }

  @Get('/detail-blog/:slug')
  getBlogsBySlugParam(
    @Param('slug') slug: string,
    @Query('id') id: string,
    @Req() req: Request,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const forwarded = req.headers['x-forwarded-for'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ip =
      typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        : (req as any).socket?.remoteAddress || 'unknown';

    return this.blogService.FindBlogBySlug(slug, id, ip);
  }

  
  @Get('/detail-category/:category')
  getDetailCategorys(
    @Param('category') category: string,
    @Query('page') page : number,
    @Query('limit') limit : number,
  ) {
    return this.blogService.getDetailCategory(category, page, limit);
  }

  @Get('/detail-category-navbar')
  getBlogsByNavbarQuery(@Query('category') category: string) {
    return this.blogService.findByCategoryNavbar(category);
  }

  @Get('/articles-one')
  getArticles01() {
    return this.blogService.findByArticles01();
  }

  @Get('/articles-list')
  getArticlesList() {
    return this.blogService.findByArticlesList();
  }

  @Post()
  create(@Body() createItemDto: CreateBlogDto) {
    return this.blogService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateBlogDto) {
    return this.blogService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}

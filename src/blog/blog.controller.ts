/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UploadedFiles,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Blog } from './schemas/blog-schema';
import { ImageKitService } from 'src/config/imagekit.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dto/upload-image.dto';

@ApiTags('Blog')
@Controller('blogs')
export class BlogController {

  constructor(
    private readonly blogService: BlogService,
    private readonly imageKitService: ImageKitService,
  ) {}

  @Post('image')
    @UseInterceptors(AnyFilesInterceptor())
    @ApiConsumes('multipart/form-data')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    @ApiBody({ type: UploadImageDto })
    @ApiOperation({ summary: 'Upload gambar ke ImageKit' })
    async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
      const image_bg_file = files.find((f) => f.fieldname === 'image_bg');
      const images_files = files.filter((f) => f.fieldname === 'images');

      const image_bg_url = image_bg_file
        ? await this.imageKitService.uploadImage(image_bg_file)
        : null;

      const images_url = await Promise.all(
        images_files.map((file) => this.imageKitService.uploadImage(file)),
      );

      return {
        image_bg_url,
        images_url,
      };
    }

  @Post()
  @ApiOperation({ summary: 'Buat blog baru' })
  createBlog(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.createBlog(createBlogDto);
  }

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

  @Get('/detail-author/:author_name')
  getAuthorBlog(
    @Param('author_name') author_name: string,
    @Query('page') page : number,
    @Query('limit') limit : number,
  ) {
    return this.blogService.getAuthorBlog(author_name, page, limit);
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

  @Get('/list')
  findAllList() {
    return this.blogService.findAllList();
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

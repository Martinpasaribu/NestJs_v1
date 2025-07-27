import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog-schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { NotFoundException } from '@nestjs/common';
import { Redis,  } from 'ioredis'; // ← pakai dari ioredis langsung

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis, // Redis Cloud
  ) {}

  async getAllBlogs(
    page = 1,
    limit = 10,
  ): Promise<{
    data: Blog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.blogModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.blogModel.countDocuments(),
    ]);

    return { data, total, page, limit };
  }

  async findByCategory(category: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Ambil data full berdasarkan kategori
    const fullData = await this.blogModel.find({ category }).sort({ createdAt: -1 }).exec();

    // Pisahkan data
    const latest = fullData[0] || null;
    const nextThree = fullData.slice(1, 4); // setelah pertama, ambil 3 berikutnya

    // Pagination response
    const paginatedData = fullData.slice(skip, skip + limit);

    return {
      latest,
      nextThree,
      fullData: paginatedData,
      total: fullData.length,
      page,
      limit,
      totalPages: Math.ceil(fullData.length / limit),
    };
  }

  async getDetailCategory(category: string, page : number , limit : number) {
    const skip = (page - 1) * limit;

    // Ambil data full berdasarkan kategori
    const fullData = await this.blogModel.find(
      { category , isDeleted: false },
      ).sort({ createdAt: -1 }).exec();


    // Pisahkan data
    const latest = fullData[0] || null;
    const nextThree = fullData.slice(1, 4); // setelah pertama, ambil 3 berikutnya

    // Pagination response
    const paginatedData = fullData.slice(skip, skip + limit);

    return {
      latest,
      nextThree,
      fullData: paginatedData,
      total: fullData.length,
      page,
      limit,
      category,
      totalPages: Math.ceil(fullData.length / limit),
    };
  }

  async FindBlogBySlug(slug: string, id: string, ip: string) {
    // 1. Cari berdasarkan slug
    // eslint-disable-next-line max-len
    let blog = await this.blogModel.findOne({ slug }).populate('author', 'name email bio images -_id').exec();

    // 2. Jika tidak ada, cari berdasarkan ID
    if (!blog && id) {
      blog = await this.blogModel.findById(id).populate('author', 'name email bio images').exec();
    }

    if (!blog) {
      throw new NotFoundException('Blog tidak ditemukan');
    }

    // 3. Cek IP di Redis
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const redisKey = `blog-view:${blog._id}:${ip}`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const alreadyViewed = await this.redis.get(redisKey);

    if (!alreadyViewed) {
      // Tambah view +1
      await this.blogModel.findByIdAndUpdate(blog._id, {
        $inc: { views: 1 },
      });

      // Simpan ke Redis agar IP ini tidak menambah view lagi dalam 24 jam
      await this.redis.set(redisKey, '1', 'EX', 60 * 60 * 24); // 24 jam
    }

    // 4. (Opsional) Ambil related blog misal berdasarkan kategori
    const relatedBlogs = await this.blogModel.find({
      _id: { $ne: blog._id },
      category: blog.category,
    }).limit(3).exec();

    return {
      data: blog,
      relatedBlogs,
    };
  }

  async findByCategoryNavbar(category: string) {
    // Projection untuk menghapus properti tertentu
    const projection: any = {
      content: 0,
      desc: 0,
      images: 0,
      view: 0,
      comment: 0,
    };

    // Ambil semua data berdasarkan kategori, terurut terbaru
    const fullRaw = await this.blogModel
      .find({ category }, projection)
      .sort({ createdAt: -1 })
      .exec();

    const main = fullRaw[0] || null;
    const main_sub = fullRaw.slice(1, 4);

    return {
      main,
      main_sub,
      total: fullRaw.length,
      totalPages: Math.ceil(fullRaw.length),
    };
  }

  async findByArticles01() {
    const projection: any = {
      content: 0,
      // images: 0,
      comment: 0,
    };

    // Ambil artikel terbaru (1 data)
    const latest = await this.blogModel
      .find({}, projection)
      .sort({ createdAt: -1 }) // Urutkan dari terbaru
      .limit(1)
      .lean();

    // Ambil 3 artikel setelah yang terbaru
    const nextThree = await this.blogModel
      .find({}, projection)
      .sort({ createdAt: -1 })
      .skip(1)
      .limit(3)
      .lean();

    return {
      latest: latest[0] || null,
      nextThree,
    };
  }

  async findByArticlesList() {
    const projection: any = {
      content: 0,
      // images: 0,
      comment: 0,
    };

    // Ambil artikel terbaru (1 data)
    const popularThree = await this.blogModel
      .find({}, projection)
      .sort({ views: -1 }) // Urutkan dari view terbanyak
      .limit(3)
      .lean();

    // Ambil 3 artikel setelah yang terbaru
    const nextThree = await this.blogModel
      .find({}, projection)
      .sort({ createdAt: -1 })
      .skip(1)
      .limit(3)
      .lean();

    return {
      nextThree,
      popularThree,
    };
  }

  async create(createItemDto: CreateBlogDto): Promise<Blog> {
    const createdItem = new this.blogModel(createItemDto);
    return createdItem.save();
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().exec();
  }

  // async findOne(id: string): Promise<Blog> {
  //   const blog = await this.blogModel.findById(id).exec();
  //   if (!blog) {
  //     throw new NotFoundException(`Blog dengan ID ${id} tidak ditemukan`);
  //   }
  //   return blog;
  // }

  async update(id: string, updateItemDto: UpdateBlogDto): Promise<Blog> {
    const updated = await this.blogModel
      .findByIdAndUpdate(id, updateItemDto, {
        new: true,
      })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Blog dengan ID ${id} tidak ditemukan`);
    }
    return updated;
  }

  async remove(id: string): Promise<Blog> {
    const deleted = await this.blogModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Blog dengan ID ${id} tidak ditemukan`);
    }
    return deleted;
  }
}

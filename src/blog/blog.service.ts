import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog-schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { NotFoundException } from '@nestjs/common';
import { Redis,  } from 'ioredis'; // ← pakai dari ioredis langsung
import { Author, AuthorDocument } from 'src/author/schemas/author-schema';


function slugToName(slug: string): string {
  return slug
    .split('-')                 // pisahkan berdasarkan "-"
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // kapitalisasi tiap kata
    .join(' ');
}

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis, // Redis Cloud
  ) {}

  async createBlog(createBlogDto: CreateBlogDto): Promise<Blog> {
    const blog = new this.blogModel(createBlogDto);
    return blog.save();
  }

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
      // eslint-disable-next-line max-len
      this.blogModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('author', 'name email bio images -_id').exec(),
      this.blogModel.countDocuments(),
    ]);

    return { data, total, page, limit };
  }

  async findByCategory(category: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Ambil data full berdasarkan kategori
    // eslint-disable-next-line max-len
    const fullData = await this.blogModel.find({ category }).sort({ createdAt: -1 }).populate('author', 'name email bio images -_id').exec();

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
      ).sort({ createdAt: -1 }).populate('author', 'name email bio images -_id').exec();


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

async getAuthorBlog(author_name: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  // 1. Cari author berdasarkan nama
  const formattedName = slugToName(author_name);
  const author = await this.authorModel.findOne({ name: formattedName });

  if (!author) {
    throw new NotFoundException(`Author with name "${formattedName}" not found`);
  }

  // 2. Ambil semua blog berdasarkan author._id
  const fullData = await this.blogModel.find(
    { author: author._id, isDeleted: false },
  )
    .sort({ createdAt: -1 })
    .populate('author', 'name email bio images') // populate tanpa -_id agar ID masih ikut
    .exec();

  // 3. Bagi data jadi latest, nextThree, dan paginated
  const latest = fullData[0] || null;
  const nextThree = fullData.slice(1, 4);
  const paginatedData = fullData.slice(skip, skip + limit);

  return {
    latest,
    nextThree,
    fullData: paginatedData,
    total: fullData.length,
    page,
    limit,
    author_name,
    totalPages: Math.ceil(fullData.length / limit),
  };
}


async FindBlogBySlug(slug: string, id: string, ip: string) {

  // 1. Cari berdasarkan slug
  // eslint-disable-next-line max-len
  let blog = await this.blogModel.findOne({ slug, isDeleted:false, status:"Live" }).populate('author', 'name email bio images -_id').exec();

  // 2. Jika tidak ada, cari berdasarkan ID
  if (!blog && id) {
    blog = await this.blogModel.findById(id).populate('author', 'name email bio images').exec();
  }

  if (!blog) {
    throw new NotFoundException(`Blog : ${slug} tidak ditemukan `);
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
  }).limit(3).populate('author', 'name email bio images -_id').exec();

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
      .populate('author', 'name email bio images -_id')
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
      .populate('author', 'name email bio images -_id')
      .lean();

    // Ambil 3 artikel setelah yang terbaru
    const nextThree = await this.blogModel
      .find({}, projection)
      .sort({ createdAt: -1 })
      .skip(1)
      .limit(3)
      .populate('author', 'name email bio images -_id')
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
      .populate('author', 'name email bio images -_id')
      .lean();

    // Ambil 3 artikel setelah yang terbaru
    const nextThree = await this.blogModel
      .find({}, projection)
      .sort({ createdAt: -1 })
      .skip(1)
      .limit(3)
      .populate('author', 'name email bio images -_id')
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
    return this.blogModel.find().populate('author', 'name email bio images -_id').exec();
  }

  async findAllList(): Promise<Blog[]> {
    return this.blogModel.find().populate('author', 'name email bio images _id').exec();
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
      .populate('author', 'name email bio images -_id')
      .exec();
    if (!updated) {
      throw new NotFoundException(`Blog dengan ID ${id} tidak ditemukan`);
    }
    return updated;
  }

  async remove(id: string): Promise<Blog> {
    // eslint-disable-next-line max-len
    const deleted = await this.blogModel.findByIdAndDelete(id).populate('author', 'name email bio images -_id').exec();
    if (!deleted) {
      throw new NotFoundException(`Blog dengan ID ${id} tidak ditemukan`);
    }
    return deleted;
  }
}

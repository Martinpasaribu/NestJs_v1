import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog-schema';
import { CreateItemDto } from './dto/create-blog.dto';
import { UpdateItemDto } from './dto/update-blog.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async create(createItemDto: CreateItemDto): Promise<Blog> {
    const createdItem = new this.blogModel(createItemDto);
    return createdItem.save();
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().exec();
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException(`Blog dengan ID ${id} tidak ditemukan`);
    }
    return blog;
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Blog> {
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

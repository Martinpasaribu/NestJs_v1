import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true, collection: 'blogs' })
export class Blog {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop()
  desc: string;

  @ApiProperty()
  @Prop()
  sub_desc: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  slug: string;

  @ApiProperty()
  @Prop()
  content: string;

  @ApiProperty({ type: [Object], required: false })
  @Prop({ type: [Object], default: [] })
  comment: any[];

  @ApiProperty({ default: 0 })
  @Prop({ default: 0 })
  view: number;

  @ApiProperty()
  @Prop()
  status: string;

  @ApiProperty()
  @Prop()
  image_bg: string;

  @ApiProperty({ type: [String] })
  @Prop([String])
  images: string[];

  @ApiProperty()
  @Prop({ type: String }) 
  category: string;

  @ApiProperty({ type: [String] })
  @Prop([String])
  tags: string[];

  @ApiProperty({ type: String }) // Hanya tampilkan sebagai string ID di Swagger
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true })
  author: mongoose.Types.ObjectId;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: false })
  isDeleted: boolean;
  

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

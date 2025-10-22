import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

// ======================
// 🧩 Reply Schema
// ======================
@Schema({ _id: true })
export class Reply {
  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  user_key: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ required: false })
  name: string;

  @ApiProperty()
  @Prop({ required: false })
  text: string;

  @ApiProperty({ default: 0 })
  @Prop({ type: Number, default: 0 })
  likes: number;

  @ApiProperty({ type: [String], default: [] })
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
  likedBy: mongoose.Types.ObjectId[];

  @ApiProperty({ type: Date })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);

// ======================
// 💬 Comment Schema
// ======================
@Schema({ _id: true })
export class Comment {
  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  user_key: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ required: false })
  name: string;

  @ApiProperty()
  @Prop({ required: false })
  text: string;

  @ApiProperty({ default: 0 })
  @Prop({ type: Number, default: 0 })
  likes: number;

  @ApiProperty({ type: [String], default: [] })
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
  likedBy: mongoose.Types.ObjectId[];

  @ApiProperty({ type: [Reply] })
  @Prop({ type: [ReplySchema], default: [] })
  replies: Reply[];

  @ApiProperty({ type: Date })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// ======================
// 📰 Blog Schema
// ======================
@Schema({ timestamps: true, collection: 'blogs' })
export class Blog {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop()
  desc?: string;

  @ApiProperty()
  @Prop()
  sub_desc?: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  slug: string;

  @ApiProperty()
  @Prop()
  content?: string;

  @ApiProperty({ type: [Comment], default: [] })
  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @ApiProperty({ default: 0 })
  @Prop({ type: Number, default: 0 })
  view: number;

  @ApiProperty()
  @Prop()
  status?: string;

  @ApiProperty()
  @Prop()
  image_bg?: string;

  @ApiProperty({ type: [String], default: [] })
  @Prop({ type: [String], default: [] })
  images: string[];

  @ApiProperty()
  @Prop()
  category?: string;

  @ApiProperty({ type: [String], default: [] })
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true })
  author: mongoose.Types.ObjectId;

  @ApiProperty({ default: false })
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AuthorDocument = Author & Document;

@Schema({ timestamps: true, collection: 'author' })
export class Author {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  bio: string;

  @ApiProperty()
  @Prop()
  images: string[];

  @ApiProperty({ type: Date })
  @Prop()
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty({ type: Date })
  @Prop()
  updatedAt: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type VisitorDocument = Visitor & Document;

@Schema({ timestamps: true, collection: 'visitors' })
export class Visitor {
  @ApiProperty({ description: 'IP address of the visitor' })
  @Prop({ required: true })
  ip: string;

  @ApiProperty({ description: 'User-Agent string (browser/device info)' })
  @Prop({ required: true })
  userAgent: string;

  @ApiProperty({ description: 'Date when the visit was recorded', type: Date })
  @Prop({ default: Date.now })
  date: Date;

  @ApiProperty({ description: 'Soft delete flag', default: false })
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty({ type: Date })
  @Prop()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Prop()
  updatedAt: Date;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);

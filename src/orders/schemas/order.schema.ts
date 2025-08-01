import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  whatsapp?: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  service: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

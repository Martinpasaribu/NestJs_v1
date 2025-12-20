import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Kyc extends Document {
  @Prop({ required: true })
  nik: string;

  @Prop({ required: true })
  nama: string;

  @Prop({ required: true })
  alamat: string;

  @Prop()
  ktpFrontUrl: string;

  @Prop()
  ktpBackUrl: string;

  @Prop()
  videoUrl: string;
}

export const KycSchema = SchemaFactory.createForClass(Kyc);
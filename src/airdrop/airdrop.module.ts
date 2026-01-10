// src/modules/Airdrop/Airdrop.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AirdropsService } from './airdrop.service';
import { AirdropsController } from './airdrop.controller';
import { Airdrop, AirdropSchema } from './schemas/airdrop.schema';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    // Daftarkan model agar bisa di-inject ke service
    MongooseModule.forFeature([{ name: Airdrop.name, schema: AirdropSchema }]),
    MediaModule,
  ],
  controllers: [AirdropsController],
  providers: [AirdropsService],
  exports: [AirdropsService], // Export agar bisa dipakai module lain (misal: SubCategory)
})
export class AirdropModule {}
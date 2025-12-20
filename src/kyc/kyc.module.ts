/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller'; // Import controllernya
import { Kyc, KycSchema } from './schemas/kyc-schema';     // Import class Kyc dan Schemanya

@Module({
  imports: [
    MongooseModule.forFeature([
      // Pastikan 'name' sesuai dengan nama class di schema (Kyc)
      { name: Kyc.name, schema: KycSchema }
    ]),
  ],
  controllers: [KycController], // Tambahkan ini agar endpoint /kyc aktif
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
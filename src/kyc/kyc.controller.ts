/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable max-len */
import { Controller, Post, UseInterceptors, UploadedFiles, Body, Get, Param, Delete } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { KycService } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'ktp_front', maxCount: 1 },
    { name: 'ktp_back', maxCount: 1 },
    { name: 'kyc_video', maxCount: 1 },
  ]))
  async uploadKyc(
    @Body() body: any, 
    @UploadedFiles() files: { ktp_front?: Express.Multer.File[], ktp_back?: Express.Multer.File[], kyc_video?: Express.Multer.File[] }
  ) {
    return this.kycService.create(body, files);
  }


  // Endpoint untuk mengambil SEMUA data: GET /kyc
  @Get()
  async getAllKyc() {
    return this.kycService.findAll();
  }

  // Endpoint untuk mengambil SATU data berdasarkan ID: GET /kyc/:id
  @Get(':id')
  async getKycById(@Param('id') id: string) {
    return this.kycService.findOne(id);
  }
  
  @Delete(':id')
  async deleteKyc(@Param('id') id: string) {
    return this.kycService.delete(id);
  }
}
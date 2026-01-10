/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
// src/modules/airdrops/airdrops.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query, BadRequestException } from '@nestjs/common';
import { AirdropsService } from './airdrop.service';
import { CreateAirdropDto } from './dto/create-airdrop.dto';
import { UpdateAirdropDto } from './dto/update-airdrop.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('airdrops')
export class AirdropsController {

  constructor(
    private readonly airdropsService: AirdropsService,
  ) {}

  // Create Airdrop
  @Post()
  create(@Body() createAirdropDto: CreateAirdropDto) {
    return this.airdropsService.create(createAirdropDto);
  }

  // Ambil Semua (Hasilnya include subCategoryCount)
  @Get()
  findAll() {
    return this.airdropsService.findAll();
  }

  // Ambil Satu berdasarkan ID string MongoDB
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Hapus tanda '+' karena MongoDB ID adalah string
    return this.airdropsService.findOne(id);
  }

  @Get('slug/:slug')
  findSlug(@Param('slug') slug: string) {
    // Hapus tanda '+' karena MongoDB ID adalah string
    return this.airdropsService.findSlug(slug);
  }

// src/modules/airdrops/airdrops.controller.ts

  @Patch()
  async update(
    @Query('id') id: string, 
    @Body() updateAirdropDto: UpdateAirdropDto
  ) {
    // Pastikan ID ada sebelum lanjut
    if (!id) throw new BadRequestException('ID airdrops diperlukan');
    
    return await this.airdropsService.update(id, updateAirdropDto);
  }

  // Hapus Data a
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.airdropsService.remove(id);
  }

  
}
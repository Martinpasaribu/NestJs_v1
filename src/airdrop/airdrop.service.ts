/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Airdrop } from './schemas/airdrop.schema';
import { CreateAirdropDto } from './dto/create-airdrop.dto';
import { UpdateAirdropDto } from './dto/update-airdrop.dto';
import { MediaService } from '../media/media.service';

@Injectable()
export class AirdropsService {
  constructor(
    @InjectModel(Airdrop.name) private airdropModel: Model<Airdrop>,

    private readonly mediaService: MediaService // Tambahkan ini
  ) {}

  // 1. Buat airdrop Baru
  async create(createAirdropDto: CreateAirdropDto): Promise<Airdrop> {
    try {
      // Logika slug sederhana: "CPNS Baru" -> "cpns-baru"
      const slug = createAirdropDto.name.toLowerCase().replace(/ /g, '-');
      
      const newAirdrop = new this.airdropModel({
        ...createAirdropDto,
        slug,
      });
      
      return await newAirdrop.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Nama airdrop atau slug sudah ada');
      }
      throw error;
    }
  }


  async findAll(): Promise<Airdrop[]> {
    return await this.airdropModel
      .find({ isDeleted: false })
      .sort({ order: 1 }) // Urutkan berdasarkan urutan manual
      .exec();
  }

  // 3. Ambil Satu Berdasarkan ID
  async findOne(id: string): Promise<Airdrop> {
    const airdrop = await this.airdropModel
      .findById(id, { isDeleted: false })
      .exec();

    if (!airdrop) {
      throw new NotFoundException(`airdrop dengan ID ${id} tidak ditemukan`);
    }
    return airdrop;
  }

  // 3. Ambil Satu Berdasarkan slug
  async findSlug(slug: string): Promise<Airdrop> {
    const airdrop = await this.airdropModel
      .findOne({ slug }, { isDeleted: false })
      .exec();

    if (!airdrop) {
      throw new NotFoundException(`airdrop dengan slug : ${slug} tidak ditemukan`);
    }
    return airdrop;
  }


async update(id: string, updateAirdropDto: any) {
  const oldAirdrop = await this.airdropModel.findById(id).exec();
  if (!oldAirdrop) throw new NotFoundException('airdrop tidak ditemukan');

  const { _id, id: temp, __v, ...cleanData } = updateAirdropDto;

  // Jalankan cleanup untuk masing-masing field
  // Tidak perlu di-await agar response API tidak terhambat proses hapus di storage
  this.mediaService.handleMediaCleanup(oldAirdrop.icon, cleanData.icon);
  this.mediaService.handleMediaCleanup(oldAirdrop.image_bg, cleanData.image_bg);
  this.mediaService.handleMediaCleanup(oldAirdrop.images, cleanData.images);

  const updated = await this.airdropModel
    .findByIdAndUpdate(id, { $set: cleanData }, { new: true })
    .exec();

  return {
    success: true,
    data: updated
  };
}

  // 5. Hapus airdrop
  // async remove(id: string) {
  //   const result = await this.airdropModel.findByIdAndDelete(id).exec();
  //   if (!result) {
  //     throw new NotFoundException(`airdrop dengan ID ${id} tidak ditemukan`);
  //   }
  //   return { message: 'airdrop berhasil dihapus' };
  // }




async remove(id: string) {
  // 1. Cari data airdrop sebelum di-update untuk mendapatkan referensi fileId
  const airdrop = await this.airdropModel.findById(id).exec();
  
  if (!airdrop) {
    throw new NotFoundException(`airdrop dengan ID ${id} tidak ditemukan`);
  }

  // 2. OPSI A: Hapus file dari ImageKit (Jika ingin storage langsung bersih)
  // Jika ingin file tetap ada (untuk fitur restore), baris di bawah ini bisa dikomentari
  await this.mediaService.removeMedia([
    airdrop.icon,
    airdrop.image_bg,
    ...(airdrop.images || [])
  ]);

  // 3. Eksekusi Soft Delete di Database
  const result = await this.airdropModel.findByIdAndUpdate(
    id, 
    { 
      isDeleted: true,
      isActive: false // Opsional: nonaktifkan juga agar tidak tampil di aplikasi
    }, 
    { new: true }
  ).exec();
  
  return { 
    success: true,
    message: 'airdrop berhasil dipindahkan ke sampah (Soft Delete)',
    data: result 
  };
}


}
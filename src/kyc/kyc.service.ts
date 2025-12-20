/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kyc } from './schemas/kyc-schema';
import ImageKit from 'imagekit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class KycService {
  private imagekit: ImageKit;

  constructor(@InjectModel(Kyc.name) private kycModel: Model<Kyc>) {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
    });
  }

  async uploadToImageKit(file: Express.Multer.File, folder: string) {
    const res = await this.imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: folder,
    });
    return res.url;
  }

  async create(data: any, files: { 
    ktp_front?: Express.Multer.File[], 
    ktp_back?: Express.Multer.File[], 
    kyc_video?: Express.Multer.File[] 
  }) {
    // 1. Validasi: Pastikan semua file wajib sudah diunggah
    if (!files.ktp_front?.[0] || !files.ktp_back?.[0] || !files.kyc_video?.[0]) {
      throw new BadRequestException('Semua dokumen (KTP Depan, Belakang, & Video) wajib diunggah');
    }

    try {
      // 2. Sekarang aman menggunakan tanda '!' karena sudah divalidasi di atas
      // atau simpan ke variabel untuk mempermudah pembacaan
      const frontFile = files.ktp_front[0];
      const backFile = files.ktp_back[0];
      const videoFile = files.kyc_video[0];

      // 3. Upload paralel agar lebih cepat (opsional, tapi disarankan)
      const [ktpFrontUrl, ktpBackUrl, videoUrl] = await Promise.all([
        this.uploadToImageKit(frontFile, '/kyc/ktp'),
        this.uploadToImageKit(backFile, '/kyc/ktp'),
        this.uploadToImageKit(videoFile, '/kyc/videos'),
      ]);

      // 4. Simpan ke MongoDB
      const newKyc = new this.kycModel({
        nik: data.nik,
        nama: data.nama,
        alamat: data.alamat,
        ktpFrontUrl,
        ktpBackUrl,
        videoUrl,
      });

      return await newKyc.save();
    } catch (error) {
      console.error('ImageKit/DB Error:', error);
      throw new BadRequestException('Gagal memproses data KYC');
    }
  }

  async findAll() {
    return await this.kycModel.find().sort({ createdAt: -1 }).exec();
  }


async delete(id: string) {
    // 2. GUNAKAN TYPE CASTING AGAR PROPERTI TERBACA
    const kyc = await this.kycModel.findById(id).exec() as any;
    
    if (!kyc) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    // Daftar file yang akan dihapus
    const filesToDelete = [kyc.ktp_front, kyc.ktp_back, kyc.kyc_video];

    filesToDelete.forEach((filePath: string) => {
      if (filePath) {
        // Sesuaikan path.join dengan lokasi folder upload Anda
        // Jika folder 'uploads' ada di root project:
        const fullPath = path.join(process.cwd(), filePath);
        
        try {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Berhasil menghapus file: ${fullPath}`);
          }
        } catch (err) {
          console.error(`Gagal menghapus file fisik: ${fullPath}`, err);
          // Kita tidak throw error di sini agar dokumen di DB tetap terhapus 
          // meskipun file fisiknya entah kenapa sudah hilang duluan
        }
      }
    });

    // Hapus data dari database
    return await this.kycModel.findByIdAndDelete(id);
  }

  // Ambil satu data berdasarkan ID (atau NIK)
  async findOne(id: string) {
    const data = await this.kycModel.findById(id).exec();
    if (!data) {
      throw new BadRequestException('Data KYC tidak ditemukan');
    }
    return data;
  }
}
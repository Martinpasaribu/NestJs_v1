import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';

@Injectable()
export class ImageKitService {
private imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});


  async uploadImage(file: Express.Multer.File): Promise<string> {
    const res = await this.imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });
    return res.url;
  }
}

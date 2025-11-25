import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.config';

@Injectable()
export class CloudinaryService {
  async uploadImage(filePath: string): Promise<string> {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'nextrade_giftcards',
    });

    return result.secure_url; // <-- return the public URL
  }
}

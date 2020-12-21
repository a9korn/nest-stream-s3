import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageS3Service {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(image, filename: string) {
    console.log('image: ', image);
    console.log('filename: ', filename);
  }
}

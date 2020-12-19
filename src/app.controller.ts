import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ImageS3Service } from './image-s3/image-s3.service';
import * as fs from 'fs';
import * as sharp from 'sharp';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly imageS3Service: ImageS3Service,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post(':filename')
  // @UseInterceptors(FileInterceptor('image'))
  async imageUpload(
    // @UploadedFile() image,
    @Res() res,
    @Param() params,
    @Req() req,
  ) {
    // const { filename } = params;
    // this.imageS3Service
    //   .uploadImage(image.buffer, filename)
    //   .then(() => {
    //     res.send('ok');
    //   })
    //   .catch(() => res.status(500).send('Failed to upload image into AWS S3!'));
    // console.log('Image: ', image);
    // console.log('Req: ', req.buffer);
    // console.log('aws: ', awsS3);

    // const length = 0;
    // const chunks = [];
    const fileStream2048 = fs.createWriteStream('uploads/logo-2048.jpg');
    const fileStream1024 = fs.createWriteStream('uploads/logo-1024.jpg');
    const fileStream300 = fs.createWriteStream('uploads/logo-300.jpg');

    const resize2048 = sharp().resize({ width: 2048 });
    const resize1024 = sharp().resize({ width: 1024 });
    const resize300 = sharp().resize({ width: 300 });

    req.pipe(resize2048).pipe(fileStream2048);
    req.pipe(resize1024).pipe(fileStream1024);
    req.pipe(resize300).pipe(fileStream300);

    res.send('ok');
  }
}

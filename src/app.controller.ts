import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
// import { ImageS3Service } from './image-s3/image-s3.service';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';
import { multerOptions } from './config/multer.config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, // private readonly imageS3Service: ImageS3Service,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post(':filename')
  @UseInterceptors(AmazonS3FileInterceptor('image', multerOptions))
  async imageUpload(
    @UploadedFile() image,
    @Param() params,
    @Res() res,
    @Req() req,
  ) {
    const { filename } = params;

    console.log(image);
  }
}

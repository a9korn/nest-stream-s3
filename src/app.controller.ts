import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ImageS3Service } from './image-s3/image-s3.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly imageS3Service: ImageS3Service,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post(':filename')
  async imageUpload(@Param() params, @Res() res, @Req() req) {
    const { filename } = params;

    this.imageS3Service
      .uploadImage(req, filename)
      .then((fname) => {
        res.send(fname);
      })
      .catch((e) => {
        res.status(500).send(e.toString());
      });
  }
}

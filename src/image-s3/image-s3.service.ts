import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as sharp from 'sharp';
import * as stream from 'stream';

@Injectable()
export class ImageS3Service {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(request, filename: string) {
    return new Promise(async (resolve, reject) => {
      const contype = request.headers['content-type']; // getting Content-Type from header
      const conlength = parseInt(request.headers['content-length']); // getting Content-Length from header
      if (!contype) return reject('Content-Type not found!');
      if (conlength > this.configService.get('MAX_UPLOAD_IMAGE_SIZE'))
        return reject(
          `File size too large! Allowed: ${this.configService.get(
            'MAX_UPLOAD_IMAGE_SIZE',
          )} bytes`,
        );

      const contype_arr = contype.split('/');
      const type = contype_arr[0];
      const ext = contype_arr[1];
      if (type !== 'image') {
        return reject('Must be only image!');
      }

      const allow_formats = this.configService.get('ALLOW_IMAGE_FORMAT');
      if (allow_formats !== undefined && allow_formats?.indexOf(ext) < 0) {
        return reject('Content-Type is not allowed!');
      }

      const s3 = new S3();
      const s3Stream = new stream.PassThrough();

      s3.upload({
        Body: s3Stream,
        Key: `${filename}-300.${ext}`,
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      }).send((err, data) => {
        if (err) {
          s3Stream.destroy(err);
          return reject(err);
        } else {
          console.log(`File uploaded and available at ${data.Location}`);
          s3Stream.destroy();
          return resolve(data.Location);
        }
      });

      const resize300 = sharp()
        .resize(300)
        .on('error', (err) => {
          return reject(err);
        });

      request.pipe(resize300).pipe(s3Stream);
    });
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class ImageS3Service {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(dataBuffer: Buffer, filename: string) {
    const awsS3 = new S3();
    awsS3.config.update({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
    return true;
    // const uploadResult = await awsS3
    //   .upload({
    //     Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
    //     Body: dataBuffer,
    //     Key: filename,
    //   })
    //   .promise();
    //
    // return uploadResult;
  }
}

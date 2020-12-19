import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ImageS3Service } from './image-s3/image-s3.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        UPLOPADS_DIR: Joi.string().required(),
        MAX_UPLOAD_IMAGE_SIZE: Joi.number().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        limits: {
          fileSize: parseInt(configService.get('MAX_UPLOAD_IMAGE_SIZE')),
        },
        // fileFilter: (req, file, cb) => {
        // cb(null, false);
        // cb(null, true);
        // cb(new Error("I don't have a clue!"), false);
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ImageS3Service],
})
export class AppModule {}

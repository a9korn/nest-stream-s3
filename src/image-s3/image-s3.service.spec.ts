import { Test, TestingModule } from '@nestjs/testing';
import { ImageS3Service } from './image-s3.service';

describe('ImageS3Service', () => {
  let service: ImageS3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageS3Service],
    }).compile();

    service = module.get<ImageS3Service>(ImageS3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

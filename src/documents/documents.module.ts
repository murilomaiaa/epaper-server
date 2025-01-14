import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { IUploadFile } from '../infra/storage/upload-file.interface';
import { MinioUploadFile } from '../infra/storage/minio-upload-file.provider';

@Module({
  imports: [],
  controllers: [DocumentsController],
  providers: [
    { provide: IUploadFile, useClass: MinioUploadFile },
    DocumentsService,
  ],
})
export class DocumentsModule {}

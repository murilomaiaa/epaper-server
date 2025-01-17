import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { IUploadFile } from '../infra/storage/upload-file.interface';
import { MinioUploadFile } from '../infra/storage/minio-upload-file.provider';
import { IDocumentsRepository } from '../infra/db/repositories/contracts/documents.repository.interface';
import { DocumentsRepository } from '../infra/db/repositories/documents.repository';

@Module({
  imports: [],
  controllers: [DocumentsController],
  providers: [
    { provide: IUploadFile, useClass: MinioUploadFile },
    { provide: IDocumentsRepository, useClass: DocumentsRepository },
    DocumentsService,
  ],
})
export class DocumentsModule {}

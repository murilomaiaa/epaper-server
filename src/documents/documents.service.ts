import { Injectable } from '@nestjs/common';
import { IUploadFile } from '../infra/storage/upload-file.interface';
import {
  IDocumentsRepository,
  SearchParams,
} from '../infra/db/repositories/contracts/documents.repository.interface';
import { Document } from './document.entity';

type CreateDto = {
  file: Express.Multer.File;
  origin: string;
  type: string;
  issuer: string;
  taxValue: number;
  netValue: number;
};

@Injectable()
export class DocumentsService {
  constructor(
    private readonly uploadProvider: IUploadFile,
    private readonly repository: IDocumentsRepository,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getById(id: string) {
    return this.repository.findById(id);
  }

  async create({ file, ...data }: CreateDto) {
    console.log('DocumentsService - Create');
    const fileName = `${Date.now()}-${file.originalname}`;
    const url = await this.uploadProvider.execute(fileName, file.path);
    const document = new Document({
      ...data,
      url,
    });
    await this.repository.create(document);
    console.log('DocumentsService - Created');
    return document;
  }

  async findMany({
    limit = 10,
    offset = 0,
    ...searchParams
  }: Partial<SearchParams>) {
    const result = await this.repository.findMany({
      ...searchParams,
      limit,
      offset,
    });

    return result;
  }
}

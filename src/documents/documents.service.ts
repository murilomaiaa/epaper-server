import { Injectable, NotFoundException } from '@nestjs/common';
import { IUploadFile } from '../infra/storage/upload-file.interface';
import {
  IDocumentsRepository,
  SearchParams,
} from '../infra/db/repositories/contracts/documents.repository.interface';
import { Document } from './document.entity';

type BaseDto = {
  origin: string;
  type: string;
  issuer: string;
  taxValue: number;
  netValue: number;
};

type CreateDto = BaseDto & {
  file: Express.Multer.File;
};

type UpdateDto = BaseDto & {
  id: string;
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

  async update(data: UpdateDto) {
    console.log('DocumentsService - Update');
    const document = await this.repository.findById(data.id);
    if (!document) {
      throw new NotFoundException(data.id);
    }

    const updatedDocument = new Document({
      ...document,
      ...data,
      updatedAt: new Date(),
    });

    await this.repository.update(updatedDocument);

    return updatedDocument;
  }

  async delete(id: string) {
    console.log('DocumentsService - Update');

    await this.repository.softDelete(id);
  }
}

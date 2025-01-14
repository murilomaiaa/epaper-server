import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { IUploadFile } from 'src/infra/storage/upload-file.interface';

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
  private readonly items: Array<Record<string, any>>;

  constructor(private readonly uploadProvider: IUploadFile) {
    this.items = [];
  }
  async getById(id: string) {
    return this.items.find((item) => item.id === id);
  }

  async create({ file }: CreateDto) {
    console.log('DocumentsService - Create');
    const fileName = `${Date.now()}-${file.originalname}`;
    await this.uploadProvider.execute(fileName, file.path);
    const newPost = { id: randomUUID() };
    this.items.push(newPost);
    return newPost;
  }
}

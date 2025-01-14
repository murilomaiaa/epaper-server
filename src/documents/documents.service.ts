import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { IUploadFile } from '../infra/storage/upload-file.interface';

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

  async create({ file, ...data }: CreateDto) {
    console.log('DocumentsService - Create');
    const fileName = `${Date.now()}-${file.originalname}`;
    await this.uploadProvider.execute(fileName, file.path);
    const now = new Date();
    const newPost = {
      id: randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(newPost);
    return newPost;
  }
}

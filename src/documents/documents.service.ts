import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class DocumentsService {
  private readonly items: Array<Record<string, any>>;

  constructor() {
    this.items = [];
  }
  async getById(id: string) {
    return this.items.find((item) => item.id === id);
  }

  async createPost(item: Record<string, any>) {
    const newPost = { ...item, id: randomUUID() };
    this.items.push(newPost);
    return newPost;
  }
}

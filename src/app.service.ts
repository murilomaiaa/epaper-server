import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

type Post = { title: string; body: string; id: string };

@Injectable()
export class AppService {
  private readonly items: Array<Post>;

  constructor() {
    this.items = [];
  }
  async getById(id: string) {
    return this.items.find((item) => item.id === id);
  }

  async createPost(item: Omit<Post, 'id'>) {
    const newPost: Post = { ...item, id: randomUUID() };
    this.items.push(newPost);
    return newPost;
  }
}

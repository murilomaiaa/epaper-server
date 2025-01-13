// contract.ts

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const contract = initContract();

const DocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
});

export const documentContract = contract.router({
  createPost: {
    method: 'POST',
    path: '/documents',
    responses: {
      201: DocumentSchema,
    },
    body: z.object({
      title: z.string(),
      body: z.string(),
    }),
    summary: 'Create a post',
  },
  getPost: {
    method: 'GET',
    path: `/documents/:id`,
    responses: {
      200: DocumentSchema,
      204: null,
    },
    summary: 'Get a post by id',
  },
});

import { Controller } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import {
  nestControllerContract,
  NestControllerInterface,
  NestRequestShapes,
  TsRest,
  TsRestRequest,
} from '@ts-rest/nest';

const c = nestControllerContract(documentContract);
type RequestShapes = NestRequestShapes<typeof c>;

@Controller()
export class DocumentsController implements NestControllerInterface<typeof c> {
  constructor(private readonly postService: DocumentsService) {}

  @TsRest(c.getPost)
  async getPost(@TsRestRequest() { params: { id } }: RequestShapes['getPost']) {
    const post = await this.postService.getById(id);

    if (!post) {
      return { status: 204 as const, body: null };
    }
    return { status: 200 as const, body: post as any };
  }

  @TsRest(c.createPost)
  async createPost(@TsRestRequest() { body }: RequestShapes['createPost']) {
    const post = await this.postService.createPost({
      title: body.title,
      body: body.body,
    });

    return { status: 201 as const, body: post as any };
  }
}

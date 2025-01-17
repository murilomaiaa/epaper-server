// contract.ts
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const contract = initContract();

const DocumentSchema = z.object({
  id: z.string(),
  url: z.string(),
  origin: z.string(),
  type: z.string(),
  issuer: z.string(),
  taxValue: z.number(),
  netValue: z.number(),
  updatedAt: z.date(),
  createdAt: z.date(),
});

const transformMoney = (value: string): number => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    console.log('invalid');
    throw new Error('Not valid input ' + value);
  }
  return parsed;
};

export const documentContract = contract.router({
  createPost: {
    method: 'POST',
    path: '/documents',
    contentType: 'multipart/form-data',
    responses: {
      201: DocumentSchema,
    },
    body: z.object({
      origin: z.string(),
      type: z.string(),
      issuer: z.string(),
      taxValue: z.string().transform(transformMoney),
      netValue: z.string().transform(transformMoney),
      file: z.any(),
    }),
    summary: 'Upload document',
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

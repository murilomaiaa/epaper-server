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

const PaginatedDocumentsSchema = z.object({
  data: z.array(DocumentSchema),
  total: z.number(),
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
  getDocument: {
    method: 'GET',
    path: `/documents/:id`,
    responses: {
      200: DocumentSchema,
      204: null,
    },
    summary: 'Get a document by id',
  },
  getDocuments: {
    method: 'GET',
    path: '/documents',
    responses: {
      200: PaginatedDocumentsSchema,
    },
    query: z.object({
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
      id: z.string().optional(),
      url: z.string().optional(),
      origin: z.string().optional(),
      type: z.string().optional(),
      issuer: z.string().optional(),
      taxValue: z.coerce.number().optional(),
      netValue: z.coerce.number().optional(),
      updatedAt: z.coerce.date().optional(),
      createdAt: z.coerce.date().optional(),
    }),
    summary: 'Get documents',
  },
});

import { randomUUID } from 'crypto';
import { Document } from '../../src/documents/document.entity';
import { documentsTable } from '../../src/infra/db/schema';

type DocumentDb = typeof documentsTable.$inferSelect;

export const makeDocumentsDb = ({
  id,
  url,
  createdAt,
  deletedAt,
  issuer,
  netValue,
  origin,
  taxValue,
  type,
  updatedAt,
}: Partial<DocumentDb> = {}): DocumentDb => {
  const now = new Date();
  return {
    id: id || randomUUID(),
    url: url || 'url',
    origin: origin || 'digital',
    type: type || 'nfe',
    issuer: issuer || 'Issuer Name',
    taxValue: taxValue || '100.25',
    netValue: netValue || '1000',
    createdAt: createdAt || now.toISOString(),
    updatedAt: updatedAt || now.toISOString(),
    deletedAt: deletedAt || null,
  };
};

export const makeDocument = ({
  id,
  url,
  createdAt,
  issuer,
  netValue,
  origin,
  taxValue,
  type,
  updatedAt,
}: Partial<Document> = {}): Document => {
  const now = new Date();
  return new Document({
    id: id || randomUUID(),
    url: url || 'url',
    origin: origin || 'digital',
    type: type || 'nfe',
    issuer: issuer || 'Issuer Name',
    taxValue: taxValue || 100.25,
    netValue: netValue || 1000,
    createdAt: createdAt || now,
    updatedAt: updatedAt || now,
  });
};

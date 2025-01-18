/* eslint-disable @typescript-eslint/no-unused-vars */
import { Document } from '../../../documents/document.entity';
import {
  IDocumentsRepository,
  SearchParams,
} from './contracts/documents.repository.interface';
import { db } from '..';
import { documentsTable } from '../schema';
import { eq } from 'drizzle-orm';

export class DocumentsRepository implements IDocumentsRepository {
  async create({
    netValue,
    taxValue,
    createdAt,
    updatedAt,
    ...document
  }: Document): Promise<void> {
    console.log('DocumentsRepository - Create');
    const d: typeof documentsTable.$inferSelect = {
      ...document,
      netValue: netValue.toString(),
      taxValue: taxValue.toString(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      deletedAt: null,
    };

    await db.insert(documentsTable).values(d);
  }

  async findById(id: string): Promise<Document | undefined> {
    const documents = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.id, id))
      .limit(1);
    if (documents.length === 0) {
      return undefined;
    }

    const [document] = documents;
    return this.mapToDocument(document);
  }

  private mapToDocument(document: typeof documentsTable.$inferSelect) {
    return new Document({
      ...document,
      netValue: Number(document.netValue),
      taxValue: Number(document.taxValue),
      createdAt: new Date(document.createdAt),
      updatedAt: new Date(document.updatedAt),
    });
  }

  async findMany(_searchParams: SearchParams): Promise<Document[]> {
    throw new Error('Method not implemented.');
  }

  async softDelete(_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async update(_document: Document): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

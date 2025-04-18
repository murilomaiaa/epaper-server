/* eslint-disable @typescript-eslint/no-unused-vars */
import { Document } from '../../../documents/document.entity';
import {
  IDocumentsRepository,
  Paginated,
  SearchParams,
} from './contracts/documents.repository.interface';
import { db } from '..';
import { documentsTable } from '../schema';
import { and, asc, eq, ne, sql } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

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

  async update({
    netValue,
    taxValue,
    createdAt,
    updatedAt,
    ...document
  }: Document): Promise<void> {
    console.log('DocumentsRepository - Update');
    const d: typeof documentsTable.$inferSelect = {
      ...document,
      netValue: netValue.toString(),
      taxValue: taxValue.toString(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      deletedAt: null,
    };

    await db.update(documentsTable).set(d).where(eq(documentsTable.id, d.id));
  }

  async findById(id: string): Promise<Document | undefined> {
    const documents = await db
      .select()
      .from(documentsTable)
      .where(
        and(
          sql`${documentsTable.createdAt} IS NOT NULL`,
          eq(documentsTable.id, id),
        ),
      )
      .limit(1);

    if (documents.length === 0) {
      return undefined;
    }

    const [document] = documents;
    return this.mapToDocument(document);
  }

  async findMany({
    limit,
    offset,
    ...searchParams
  }: SearchParams): Promise<Paginated<Document>> {
    const select = db
      .select()
      .from(documentsTable)
      .orderBy(asc(documentsTable.createdAt))
      .limit(limit)
      .offset(offset);
    const filters = [sql`${documentsTable.createdAt} IS NOT NULL`];

    const tbColumnMap: Record<keyof Document, any> = {
      id: documentsTable.id,
      createdAt: documentsTable.createdAt,
      issuer: documentsTable.issuer,
      netValue: documentsTable.netValue,
      origin: documentsTable.origin,
      taxValue: documentsTable.taxValue,
      type: documentsTable.type,
      updatedAt: documentsTable.updatedAt,
      url: documentsTable.url,
      deletedAt: documentsTable.deletedAt,
    };

    Object.entries(searchParams).forEach(([key, value]) => {
      const tbKey = tbColumnMap[key as keyof Document];
      filters.push(eq(tbKey, value.toString()));
    });
    select.where(and(...filters));

    const count = db.$count(documentsTable, and(...filters));

    const [data, total] = await Promise.all([select, count]);
    return { data: data.map(this.mapToDocument), total };
  }

  async softDelete(id: string): Promise<void> {
    console.log('DocumentsRepository - Delete');

    await db
      .update(documentsTable)
      .set({ deletedAt: sql`NOW()` })
      .where(eq(documentsTable.id, id));
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
}

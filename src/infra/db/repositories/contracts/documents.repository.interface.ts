import { Document } from '../../../../documents/document.entity';

export type SearchParams = Partial<Document> & {
  limit: number;
  offset: number;
};

export abstract class IDocumentsRepository {
  abstract create(document: Document): Promise<void>;
  abstract findById(id: string): Promise<Document | undefined>;
  abstract findMany(searchParams: SearchParams): Promise<Document[]>;
  abstract softDelete(id: string): Promise<void>;
  abstract update(document: Document): Promise<void>;
}

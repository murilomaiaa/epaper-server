import { Document } from '../../../../documents/document.entity';

export abstract class IDocumentsRepository {
  abstract create(document: Document): Promise<void>;
  abstract findById(id: string): Promise<Document | undefined>;
}

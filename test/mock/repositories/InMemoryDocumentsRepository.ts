import { Document } from '../../../src/documents/document.entity';
import {
  IDocumentsRepository,
  Paginated,
  SearchParams,
} from '../../../src/infra/db/repositories/contracts/documents.repository.interface';

export class InMemoryDocumentRepository extends IDocumentsRepository {
  private documents: Map<string, Document>;

  constructor() {
    super();
    this.documents = new Map<string, Document>();
  }

  async create(document: Document): Promise<void> {
    this.documents.set(document.id, document);
  }

  async findById(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async findMany(searchParams: SearchParams): Promise<Paginated<Document>> {
    const { limit, offset, ...filters } = searchParams;
    let filteredDocuments = Array.from(this.documents.values());

    for (const key in filters) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc[key as keyof Document] === filters[key as keyof Document],
      );
    }

    const total = filteredDocuments.length;
    const data = filteredDocuments.slice(offset, offset + limit);

    return { data, total };
  }

  async softDelete(id: string): Promise<void> {
    const document = this.documents.get(id);
    if (document) {
      document.deletedAt = new Date();
      this.documents.set(id, document);
    }
  }

  async update(document: Document): Promise<void> {
    if (this.documents.has(document.id)) {
      document.updatedAt = new Date();
      this.documents.set(document.id, document);
    }
  }
}

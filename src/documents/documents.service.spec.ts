import { InMemoryDocumentRepository } from '../../test/mock/repositories/InMemoryDocumentsRepository';
import { DocumentsService } from './documents.service';
import { makeDocument } from '../../test/mock/documents.mock';
import { IDocumentsRepository } from '../infra/db/repositories/contracts/documents.repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repository: IDocumentsRepository;

  beforeEach(() => {
    repository = new InMemoryDocumentRepository();
    service = new DocumentsService(
      { execute: jest.fn().mockResolvedValue('url') },
      repository,
    );
  });
  it('should create', async () => {
    const result = await service.create({
      file: {} as any,
      issuer: 'Issuer',
      netValue: 1000,
      origin: 'origin',
      taxValue: 100.25,
      type: 'NFS',
    });

    expect(result.id).toBeDefined();
    expect(result.url).toEqual('url');
  });

  it('should update', async () => {
    const document = makeDocument({ createdAt: new Date('2020-01-01') });
    await repository.create(document);

    await service.update(document);

    const documentDb = await repository.findById(document.id);

    expect(documentDb?.updatedAt).not.toEqual(document.updatedAt);
  });

  it('should throws when document is not registered', async () => {
    const document = makeDocument();

    const promise = service.update(document);

    await expect(promise).rejects.toBeInstanceOf(NotFoundException);
  });
});

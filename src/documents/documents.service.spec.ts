import { DocumentsService } from './documents.service';

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeEach(() => {
    service = new DocumentsService(
      { execute: jest.fn() },
      { create: jest.fn(), findById: jest.fn() },
    );
  });
  it('should upload', async () => {
    const result = await service.create({
      file: {} as any,
      issuer: 'Issuer',
      netValue: 1000,
      origin: 'origin',
      taxValue: 100.25,
      type: 'NFS',
    });

    expect(result).toBeDefined();
  });
});

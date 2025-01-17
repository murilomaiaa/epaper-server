import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

describe('PostController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let documentId: string;
  it('POST /documents', async () => {
    const file = join(__dirname, 'mock', 'cv-murilo.pdf');

    const response = await request(app.getHttpServer())
      .post('/documents')
      .attach('file', file)
      .field({
        origin: 'digital',
        type: 'nfe',
        issuer: 'Issuer Name',
        taxValue: 100.25,
        netValue: 1000,
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    documentId = response.body.id;
  });

  it('GET /documents/:id unknown', () => {
    return request(app.getHttpServer())
      .get(`/documents/${randomUUID()}`)
      .expect(204);
  });

  it('GET /documents/:id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/documents/${documentId}`)
      .expect(200);

    expect(response.body.origin).toEqual('digital');
    expect(response.body.type).toEqual('nfe');
    expect(response.body.issuer).toEqual('Issuer Name');
    expect(response.body.taxValue).toEqual(100.25);
    expect(response.body.netValue).toEqual(1000);
  });
});

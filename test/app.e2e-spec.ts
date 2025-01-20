import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { db } from '../src/infra/db';
import { documentsTable } from '../src/infra/db/schema';
import { makeDocumentsDb } from './mock/documents.mock';

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

  it('GET /documents/?query', async () => {
    const issuer = Date.now().toString();
    const count = await db.$count(documentsTable);

    await db
      .insert(documentsTable)
      .values([
        makeDocumentsDb({ type: 'nfs', issuer }),
        makeDocumentsDb({ type: 'nfs', issuer }),
        makeDocumentsDb({ type: 'nfe', issuer }),
      ]);

    const response = await request(app.getHttpServer())
      .get(`/documents/?issuer=${issuer}`)
      .expect(200);

    expect(response.body.data.length).toBe(3);
    expect(response.body.total).toBe(count + 3);
  });

  it('PUT /documents/:id', async () => {
    const id = randomUUID();
    const document = makeDocumentsDb({ id });
    await db.insert(documentsTable).values([document]);

    const response = await request(app.getHttpServer())
      .post(`/documents/${id}`)
      .send({
        origin: 'scanned',
        type: 'nfs',
        issuer: 'Name',
        taxValue: 100,
        netValue: 1000,
      })
      .expect(200);

    expect(response.body.updatedAt).not.toEqual(document.createdAt);
    expect(response.body.origin).toEqual('scanned');
    expect(response.body.type).toEqual('nfs');
    expect(response.body.issuer).toEqual('Name');
    expect(response.body.taxValue).toEqual(100);
    expect(response.body.netValue).toEqual(1000);
  });

  it('DELETE /documents/:id', async () => {
    const id = randomUUID();
    const document = makeDocumentsDb({ id });
    await db.insert(documentsTable).values([document]);

    await request(app.getHttpServer()).delete(`/documents/${id}`).expect(204);

    await request(app.getHttpServer()).get(`/documents/${id}`).expect(204);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PostController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let postCode: string;
  it('POST /posts', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'post', body: 'body' })
      .expect(201);

    expect(response.body.id).toBeDefined();
    postCode = response.body.id;
  });

  it('GET /posts/:id', () => {
    return request(app.getHttpServer()).get('/posts/un-known').expect(204);
  });

  it('GET /posts/:id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/posts/${postCode}`)
      .expect(200);

    expect(response.body.title).toBe('post');
  });
});

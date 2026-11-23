import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Cards API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/cards (GET)', () => {
    return request(app.getHttpServer())
      .get('/cards')
      .expect(200)
      .expect(({ body }) => {
        const responseBody = body as { data?: unknown };
        if (!Array.isArray(responseBody.data)) {
          throw new Error('Expected /cards to return a data array');
        }
      });
  });

  afterEach(async () => {
    await app.close();
  });
});

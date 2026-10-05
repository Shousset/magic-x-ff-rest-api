import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Cards & Collections API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) - is not a frontend route on the API', async () => {
    await request(app.getHttpServer()).get('/').expect(404);
  });

  it('/cards/sets (GET) - returns registered sets (FIN & HOB)', async () => {
    const res = await request(app.getHttpServer())
      .get('/cards/sets')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    const setCodes = res.body.map((s: { setCode: string }) => s.setCode);
    expect(setCodes).toContain('FIN');
    expect(setCodes).toContain('HOB');
  });

  it('/cards?setCode=HOB (GET) - filters only The Hobbit cards', async () => {
    const res = await request(app.getHttpServer())
      .get('/cards?setCode=HOB')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    const allHob = res.body.data.every(
      (c: { setCode: string }) => c.setCode === 'HOB',
    );
    expect(allHob).toBe(true);
  });

  it('/cards?setCode=FIN (GET) - filters only Final Fantasy cards', async () => {
    const res = await request(app.getHttpServer())
      .get('/cards?setCode=FIN')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    const allFin = res.body.data.every(
      (c: { setCode: string }) => c.setCode === 'FIN',
    );
    expect(allFin).toBe(true);
  });

  it('/cards?search=Bilbo (GET) - finds Bilbo cards', async () => {
    const res = await request(app.getHttpServer())
      .get('/cards?search=Bilbo')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].name.toLowerCase()).toContain('bilbo');
  });
});

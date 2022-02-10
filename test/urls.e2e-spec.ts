import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UrlsModule } from './../src/urls/urls.module';
import { UrlsService } from './../src/urls/services';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';

describe('Urls', () => {
  let url = {
    encodeRequestCountry: 'OTHERS',
    totalClicks: 5,
    id: 'AEqzgnKpmj4LHDxoctDrHM',
    name: 'https://www.google.com',
    visits: [{ count: 5, country: 'OTHERS' }],
    createdAt: new Date('2022-02-09T01:12:04.457Z'),
    updatedAt: new Date('2022-02-09T01:12:27.777Z'),
  };
  let app: INestApplication;
  let urlsService = {
    decode: () => ({ url: url.name }),
    encode: () => ({ id: url.id }),
    getStatistics: () => ({ totalClicks: url.totalClicks, visits: url.visits }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, UrlsModule],
    })
      .overrideProvider(UrlsService)
      .useValue(urlsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST /urls/encode`, () => {
    return request(app.getHttpServer())
      .post('/urls/encode')
      .send({
        urlName: url.name,
      })
      .expect(201)
      .expect(urlsService.encode());
  });

  it(`/REDIRECT /urls/decode/${url.id}`, () => {
    return request(app.getHttpServer())
      .get(`/urls/decode/${url.id}`)
      .expect(302)
      .expect({});
  });

  it(`/GET /urls/statistics/${url.id}`, () => {
    return request(app.getHttpServer())
      .get(`/urls/statistics/${url.id}`)
      .expect(200)
      .expect(urlsService.getStatistics());
  });

  afterAll(async () => {
    await app.close();
  });
});

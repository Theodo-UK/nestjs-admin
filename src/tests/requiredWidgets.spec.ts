import * as request from 'supertest';
import { JSDOM } from 'jsdom';
import { EntityWithRequiredFields } from './entities/entityWithRequiredFields.entity';
import { createAndStartTestApp, TestApplication } from './utils/testApp';

describe('adminSite.register', () => {
  let document: Document;
  let app: TestApplication;
  let server: any;

  beforeAll(async () => {
    app = await createAndStartTestApp({ registerEntities: [EntityWithRequiredFields] });
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await app.startTest();
    const dom = new JSDOM();
    document = dom.window.document;
  });

  afterEach(async () => {
    await app.stopTest();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should set the correct fields to be required', async () => {
    const res = await request(server).get(`/admin/test/entitywithrequiredfields/add`);
    expect(res.status).toBe(200);
    document.documentElement.innerHTML = res.text;

    expect(document.querySelector('input[name="requiredString"][required]')).toBeTruthy();
    expect(document.querySelector('select[name="requiredEnum"][required]')).toBeTruthy();

    expect(document.querySelector('input[name="nullableString"]')).toBeTruthy();
    expect(document.querySelector('select[name="nullableEnum"]')).toBeTruthy();
    expect(document.querySelector('input[name="nullableString"][required]')).toBeFalsy();
    expect(document.querySelector('select[name="nullableEnum"][required]')).toBeFalsy();
  });
});

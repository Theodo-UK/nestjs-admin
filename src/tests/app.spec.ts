import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as request from 'supertest';
import { displayName } from '../adminCore/admin.filters';
import { User } from '../../exampleApp/src/user/user.entity';
import { createTestUser } from './utils/entityUtils';
import { createAndStartTestApp, TestApplication } from './utils/testApp';

describe('AppController', () => {
  let app: TestApplication;

  beforeAll(async () => {
    app = await createAndStartTestApp({ registerEntities: [User] });
  });

  beforeEach(async () => {
    await app.startTest();
  });

  afterEach(async () => {
    await app.stopTest();
  });

  afterAll(async () => {
    await app.close();
  });

  it('can delete a user', async () => {
    // add the user to the database
    const userData = createTestUser({ firstName: 'Max' });
    const entityManager: EntityManager = app.get(getEntityManagerToken());
    const user = await entityManager.save(userData);
    expect(await entityManager.findOneOrFail(User, user.id)).toBeDefined();

    // delete the user via the api call
    const server = app.getHttpServer();
    const req = await request(server).post(`/admin/test/user/${user.id}/delete`);
    expect(req.status).toBe(302);
    expect(req.header.location).toBe(`/admin/test/user`);

    const expectedDisplayName = displayName(user, entityManager.connection.getMetadata(User));
    const res = await request(server)
      .get(`/admin/test/user`)
      .set('Cookie', req.get('Set-Cookie')[0]);
    expect(res.text).toContain(`Successfully deleted User: ${expectedDisplayName}`);

    expect(await entityManager.findOne(User, user.id)).toBeUndefined();
  });
});

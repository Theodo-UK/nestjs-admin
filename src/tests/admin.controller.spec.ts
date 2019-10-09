import * as request from 'supertest'
import DefaultAdminSite from '../adminCore/adminSite'
import { injectionTokens } from '../tokens'
import { EntityManager } from 'typeorm'
import { EntityWithCompositePrimaryKey } from './entities/entityWithCompositePrimaryKey.entity'
import { changeUrl } from '../utils/urls'
import { createAndStartTestApp, TestApplication } from './utils/testApp'

describe('AdminCoreModuleFactory', () => {
  let app: TestApplication
  let adminSite: DefaultAdminSite

  beforeAll(async () => {
    app = await createAndStartTestApp()

    adminSite = app.get(injectionTokens.ADMIN_SITE)
    adminSite.register('test', EntityWithCompositePrimaryKey)
  })

  beforeEach(async () => {
    await app.startTest()
  })

  afterEach(async () => {
    await app.stopTest()
  })

  afterAll(async () => {
    await app.close()
  })

  it('can display a form for an entity with composite primary key', async () => {
    const metadata = adminSite.getEntityMetadata(EntityWithCompositePrimaryKey)
    const entityManager = app.get(EntityManager)
    expect(metadata.hasMultiplePrimaryKeys).toBe(true)

    const entity = await entityManager.save(new EntityWithCompositePrimaryKey())

    const server = app.getHttpServer()
    const res = await request(server).get(changeUrl(adminSite.getSection('test'), metadata, entity))

    expect(res.status).toBe(200)
  })

  it('can save a change for an entity with composite primary key', async () => {
    const metadata = adminSite.getEntityMetadata(EntityWithCompositePrimaryKey)
    expect(metadata.hasMultiplePrimaryKeys).toBe(true)

    const entity = await adminSite.entityManager.save(new EntityWithCompositePrimaryKey())
    expect(await adminSite.entityManager.count(EntityWithCompositePrimaryKey)).toBe(1)

    const server = app.getHttpServer()
    const newData = { ...entity, country: 'France' }
    const res = await request(server)
      .post(changeUrl(adminSite.getSection('test'), metadata, entity))
      .send(newData)

    expect(res.status).toBe(302)

    const updatedEntity: EntityWithCompositePrimaryKey = (await adminSite.entityManager.findOne(
      EntityWithCompositePrimaryKey,
      {
        id: entity.id,
      },
    )) as any
    expect(updatedEntity.country).toEqual('France')
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AdminCoreModuleFactory } from '../adminCore.module'
import DefaultAdminSite from '../adminSite'
import { injectionTokens } from '../tokens'
import { getEntityManagerToken, getConnectionToken } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import { EntityWithCompositePrimaryKey } from './entities/entityWithCompositePrimaryKey.entity'
import { changeUrl } from '../utils/urls'
import { TestAuthModule } from './utils/testAuth.module'

describe('AdminCoreModuleFactory', () => {
  let app: INestApplication
  let adminSite: DefaultAdminSite

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule.forRoot(),
        TestAuthModule,
        AdminCoreModuleFactory.createAdminCoreModule({}),
      ],
    })
      .overrideProvider(getEntityManagerToken())
      .useFactory({
        factory: (connection: any) => {
          const queryRunner: any = connection.createQueryRunner()
          const entityManager: any = connection.createEntityManager(queryRunner)
          return entityManager
        },
        inject: [getConnectionToken()],
      })
      .compile()
    app = module.createNestApplication()
    await app.init()

    adminSite = app.get(injectionTokens.ADMIN_SITE)
    adminSite.register('test', EntityWithCompositePrimaryKey)
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await app.get(getEntityManagerToken()).queryRunner.startTransaction()
  })

  afterEach(async () => {
    await app.get(getEntityManagerToken()).queryRunner.rollbackTransaction()
  })

  it('can display a form for an entity with composite primary key', async () => {
    const metadata = adminSite.getEntityMetadata(EntityWithCompositePrimaryKey)
    const entityManager = app.get(EntityManager)
    expect(metadata.hasMultiplePrimaryKeys).toBe(true)

    const entity = await entityManager
      .getRepository(EntityWithCompositePrimaryKey)
      .save(new EntityWithCompositePrimaryKey())

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

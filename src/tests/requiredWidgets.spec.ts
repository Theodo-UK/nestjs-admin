import { Test, TestingModule } from '@nestjs/testing'
import { Module, INestApplication } from '@nestjs/common'
import DefaultAdminSite from '../adminSite'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import * as request from 'supertest'
import { AdminCoreModuleFactory } from '../adminCore.module'
import { TestAuthModule } from './utils/testAuth.module'
import { JSDOM } from 'jsdom'
import { EntityWithRequiredFields } from './entities/entityWithRequiredFields.entity'

const DefaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

@Module({
  imports: [
    TypeOrmModule.forFeature([EntityWithRequiredFields]),
    TestAuthModule,
    DefaultCoreModule,
  ],
  exports: [TypeOrmModule],
})
class RegisteredEntityModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('test', EntityWithRequiredFields)
  }
}

describe('adminSite.register', () => {
  let document: Document
  let app: INestApplication
  let server: any

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestTypeOrmModule.forRoot(), RegisteredEntityModule],
    }).compile()
    app = module.createNestApplication()
    await app.init()
    server = app.getHttpServer()
  })

  beforeEach(() => {
    const dom = new JSDOM()
    document = dom.window.document
  })

  afterAll(async () => {
    await app.close()
  })

  it('should set the correct fields to be required', async () => {
    const res = await request(server).get(`/admin/test/entitywithrequiredfields/add`)
    expect(res.status).toBe(200)
    document.documentElement.innerHTML = res.text

    expect(document.querySelector('input[name="requiredString"][required]')).toBeTruthy()
    expect(document.querySelector('select[name="requiredEnum"][required]')).toBeTruthy()

    expect(document.querySelector('input[name="nullableString"]')).toBeTruthy()
    expect(document.querySelector('select[name="nullableEnum"]')).toBeTruthy()
    expect(document.querySelector('input[name="nullableString"][required]')).toBeFalsy()
    expect(document.querySelector('select[name="nullableEnum"][required]')).toBeFalsy()

    await app.close()
  })
})

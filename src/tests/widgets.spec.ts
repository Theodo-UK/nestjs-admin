import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, Module } from '@nestjs/common'
import * as request from 'supertest'
import { JSDOM } from 'jsdom'
import { AdminCoreModuleFactory } from '../adminCore.module'
import { TestAuthModule } from './utils/testAuth.module'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import { User } from '../../exampleApp/src/user/user.entity'
import { Agency } from '../../exampleApp/src/user/agency.entity'
import { Group } from '../../exampleApp/src/user/group.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import DefaultAdminSite from '../adminSite'

const DefaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})
@Module({
  imports: [DefaultCoreModule, TypeOrmModule.forFeature([User])],
})
// @ts-ignore
class RegisteredEntityModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('user', User)
  }
}

describe('widgets', () => {
  let app: INestApplication
  let document: Document

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule.forRoot(),
        RegisteredEntityModule,
        TestAuthModule,
        AdminCoreModuleFactory.createAdminCoreModule({}),
      ],
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  beforeEach(() => {
    const dom = new JSDOM()
    document = dom.window.document
  })

  afterAll(async () => {
    await app.close()
  })

  it('renders all options for an enum', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/user/user/add`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('select[name="gender"]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value=""]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value="male"]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value="female"]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value="other"]')).toBeTruthy()
  })
})

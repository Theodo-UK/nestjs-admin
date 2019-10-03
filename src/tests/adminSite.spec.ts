import { Test, TestingModule } from '@nestjs/testing'
import { Module } from '@nestjs/common'
import { getConnection } from '../utils/typeormSwitch'
import DefaultAdminSite from '../adminSite'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import AdminEntity from '../adminEntity'
import * as request from 'supertest'
import { AdminCoreModuleFactory } from '../adminCore.module'
import { Group } from '../../exampleApp/src/user/group.entity'
import { TestAuthModule } from './utils/testAuth.module'
import { JSDOM } from 'jsdom'
import { InvalidAdminRegistration } from '../exceptions/invalidAdminRegistration.exception'

const DefaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

@Module({
  imports: [TypeOrmModule.forFeature([Group]), TestAuthModule, DefaultCoreModule],
  exports: [TypeOrmModule],
})
// @ts-ignore
class RegisteredEntityModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('group', Group)
  }
}

describe('adminSite.register', () => {
  let document: Document

  beforeEach(() => {
    const dom = new JSDOM()
    document = dom.window.document
  })
  it('should register an entity', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestTypeOrmModule.forRoot({ entities: [Group] }), RegisteredEntityModule],
    }).compile()
    const app = module.createNestApplication()
    await app.init()
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin`)
    expect(res.status).toBe(200)
    document.documentElement.innerHTML = res.text
    expect(document.querySelector('a[href="/admin/group/group"]')).toBeTruthy()
    await app.close()
  })

  it('should register an AdminEntity', async () => {
    class GroupAdmin extends AdminEntity {
      entity = Group
    }

    @Module({
      imports: [TypeOrmModule.forFeature([Group]), TestAuthModule, DefaultCoreModule],
      exports: [TypeOrmModule],
    })
    class RegisteredAdminEntityModule {
      constructor(private readonly adminSite: DefaultAdminSite) {
        adminSite.register('group', GroupAdmin)
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestTypeOrmModule.forRoot({ entities: [Group] }), RegisteredAdminEntityModule],
    }).compile()
    const app = module.createNestApplication()
    await app.init()
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin`)
    expect(res.status).toBe(200)
    document.documentElement.innerHTML = res.text
    expect(document.querySelector('a[href="/admin/group/group"]')).toBeTruthy()
    await app.close()
  })

  it('should throw an error if you try to register neither an Entity or an AdminEntity', async () => {
    @Module({
      imports: [TypeOrmModule, DefaultCoreModule],
      exports: [TypeOrmModule],
    })
    class RegisteredInvalidModule {
      constructor(private readonly adminSite: DefaultAdminSite) {
        adminSite.register('Group', class {})
      }
    }

    expect(
      Test.createTestingModule({
        imports: [TestTypeOrmModule.forRoot(), RegisteredInvalidModule],
      })
        .compile()
        .finally(async () => {
          const connection = await getConnection()
          connection.close()
        }),
    ).rejects.toThrow(InvalidAdminRegistration)
  })
})

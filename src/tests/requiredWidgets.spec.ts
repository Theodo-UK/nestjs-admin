import { Test, TestingModule } from '@nestjs/testing'
import { Module, INestApplication } from '@nestjs/common'
import { getConnection } from 'typeorm'
import DefaultAdminSite from '../adminSite'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import AdminEntity from '../adminEntity'
import * as request from 'supertest'
import { AdminCoreModuleFactory } from '../adminCore.module'
import { Group } from '../../exampleApp/src/user/group.entity'
import { TestAuthModule } from '../../exampleApp/test/testAuth/testAuth.module'
import { JSDOM } from 'jsdom'
import { InvalidAdminRegistration } from '../exceptions/invalidAdminRegistration.exception'

const DefaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

enum TestEnum {
  first = 'first',
  second = 'second',
  third = 'third',
}

@Entity('dummyentities')
class DummyEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  requiredString: string

  @Column('enum', { enum: TestEnum })
  requiredEnum: TestEnum

  @Column({ length: 50, nullable: true })
  nullableString: string

  @Column('enum', { enum: TestEnum, nullable: true })
  nullableEnum: TestEnum
}

@Module({
  imports: [TypeOrmModule.forFeature([DummyEntity]), TestAuthModule, DefaultCoreModule],
  exports: [TypeOrmModule],
})
class RegisteredEntityModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('test', DummyEntity)
  }
}

describe('adminSite.register', () => {
  let document: Document
  let app: INestApplication
  let server: any

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestTypeOrmModule.forRoot({ entities: [DummyEntity] }), RegisteredEntityModule],
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
    const res = await request(server).get(`/admin/test/dummyentity/add`)
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

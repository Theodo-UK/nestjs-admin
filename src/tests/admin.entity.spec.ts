import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TestAuthModule } from './utils/testAuth.module'
import { Group } from '../../exampleApp/src/user/group.entity'
import { JSDOM } from 'jsdom'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import { Module } from '@nestjs/common'
import DefaultAdminSite from '../adminSite'
import AdminEntity from '../adminEntity'
import { AdminCoreModuleFactory } from '../adminCore.module'
import InvalidDisplayFieldsException from '../exceptions/invalidDisplayFields.exception'

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

const DefaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

@Catch(InvalidDisplayFieldsException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: InvalidDisplayFieldsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(500).json({
      error: 'InvalidDisplayFieldsException',
    })
  }
}

describe('adminEntity', () => {
  let document: Document

  beforeEach(() => {
    const dom = new JSDOM()
    document = dom.window.document
  })

  it('throws an exception when there is a field that does not exist', async () => {
    class GroupAdmin extends AdminEntity {
      entity = Group
      fields = ['id', 'name', 'ghosts']
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
    app.useGlobalFilters(new HttpExceptionFilter())
    await app.init()
    const server = app.getHttpServer()

    const response = await request(server).get(`/admin/group/group`)

    expect(response.status).toBe(500)
    expect(response.body).toMatchObject({ error: 'InvalidDisplayFieldsException' })

    await app.close()
  })

  it('throws an exception when there is a duplicate field', async () => {
    class GroupAdmin extends AdminEntity {
      entity = Group
      fields = ['id', 'name', 'name']
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
    app.useGlobalFilters(new HttpExceptionFilter())
    await app.init()
    const server = app.getHttpServer()

    const response = await request(server).get(`/admin/group/group`)

    expect(response.status).toBe(500)
    expect(response.body).toMatchObject({ error: 'InvalidDisplayFieldsException' })

    await app.close()
  })
})

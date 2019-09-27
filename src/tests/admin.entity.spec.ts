import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TestAuthModule } from './utils/testAuth.module'
import { Group } from '../../exampleApp/src/user/group.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import { Module } from '@nestjs/common'
import DefaultAdminSite from '../adminSite'
import AdminEntity from '../adminEntity'
import { AdminCoreModuleFactory } from '../adminCore.module'
import InvalidAdminEntityFormConfig from '../exceptions/invalidAdminEntityFormConfig.exception'
import { createTestGroup } from './utils/entityUtils'
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Response } from 'express'

const DefaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

@Catch(InvalidAdminEntityFormConfig)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: InvalidAdminEntityFormConfig, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(500).json({
      error: 'InvalidAdminEntityFormConfig',
    })
  }
}

describe('adminEntity', () => {
  it('throws an exception when there is an add field that does not exist', async () => {
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

    const response = await request(server).get(`/admin/group/group/add`)

    expect(response.status).toBe(500)
    expect(response.body).toMatchObject({ error: 'InvalidAdminEntityFormConfig' })

    await app.close()
  })

  it('throws an exception when there is a change field that does not exist', async () => {
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

    const groupData = createTestGroup({ name: 'Harry', id: 5 })
    const groupRepository: Repository<Group> = app.get(getRepositoryToken(Group))
    const group = await groupRepository.save(groupData)
    expect(await groupRepository.findOneOrFail(group.id)).toBeDefined()

    app.useGlobalFilters(new HttpExceptionFilter())
    await app.init()
    const server = app.getHttpServer()

    const response = await request(server).get(`/admin/group/group/${group.id}/change`)

    expect(response.status).toBe(500)
    expect(response.body).toMatchObject({ error: 'InvalidAdminEntityFormConfig' })

    await app.close()
  })

  it('throws an exception when there is a duplicate add field', async () => {
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

    const response = await request(server).get(`/admin/group/group/add`)

    expect(response.status).toBe(500)
    expect(response.body).toMatchObject({ error: 'InvalidAdminEntityFormConfig' })

    await app.close()
  })

  it('throws an exception when there is a duplicate change field', async () => {
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

    const groupData = createTestGroup({ name: 'Harry', id: 5 })
    const groupRepository: Repository<Group> = app.get(getRepositoryToken(Group))
    const group = await groupRepository.save(groupData)
    expect(await groupRepository.findOneOrFail(group.id)).toBeDefined()

    app.useGlobalFilters(new HttpExceptionFilter())
    await app.init()
    const server = app.getHttpServer()

    const response = await request(server).get(`/admin/group/group/${group.id}/change`)

    expect(response.status).toBe(500)
    expect(response.body).toMatchObject({ error: 'InvalidAdminEntityFormConfig' })

    await app.close()
  })
})

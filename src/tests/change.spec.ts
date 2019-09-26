import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as request from 'supertest'
import { User } from '../../exampleApp/src/user/user.entity'
import { createTestUser } from './utils/entityUtils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import { TestAuthModule } from './utils/testAuth.module'
import AdminEntity from '../adminEntity'
import { AdminCoreModuleFactory } from '../adminCore.module'
import { JSDOM } from 'jsdom'
import DefaultAdminSite from '../adminSite'
import { Module } from '@nestjs/common'
import { Agency } from '../../exampleApp/src/user/agency.entity'
import { Group } from '../../exampleApp/src/user/group.entity'

const DefaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

describe('change', () => {
  let document: Document

  beforeEach(() => {
    const dom = new JSDOM()
    document = dom.window.document
  })

  it('Only configured fields are present', async () => {
    class UserAdmin extends AdminEntity {
      entity = User
      fields = ['firstName', 'lastName', 'gender']
    }

    @Module({
      imports: [TypeOrmModule.forFeature([User]), TestAuthModule, DefaultCoreModule],
      exports: [TypeOrmModule],
    })
    class RegisteredAdminEntityModule {
      constructor(private readonly adminSite: DefaultAdminSite) {
        adminSite.register('user', UserAdmin)
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule.forRoot({ entities: [User, Agency, Group] }),
        RegisteredAdminEntityModule,
      ],
    }).compile()

    const app = module.createNestApplication()
    await app.init()

    const userData = createTestUser({ firstName: 'Pallavi' })
    const userRepository: Repository<User> = app.get(getRepositoryToken(User))
    const user = await userRepository.save(userData)
    expect(await userRepository.findOneOrFail(user.id)).toBeDefined()

    const server = app.getHttpServer()
    const req = await request(server).get(`/admin/user/user/${user.id}/change`)

    document.documentElement.innerHTML = req.text

    expect(document.querySelector('label[for="firstName"]')).toBeTruthy()
    expect(document.querySelector('label[for="lastName"]')).toBeTruthy()
    expect(document.querySelector('label[for="gender"]')).toBeTruthy()

    expect(document.querySelector('label[for="createdDate"]')).toBeFalsy()
    expect(document.querySelector('label[for="password"]')).toBeFalsy()
    expect(document.querySelector('label[for="email"]')).toBeFalsy()
    expect(document.querySelector('label[for="roles"]')).toBeFalsy()
    expect(document.querySelector('label[for="moreRoles"]')).toBeFalsy()
    expect(document.querySelector('label[for="description"]')).toBeFalsy()
    expect(document.querySelector('label[for="agency"]')).toBeFalsy()
    expect(document.querySelector('label[for="groups"]')).toBeFalsy()
    expect(document.querySelector('label[for="age"]')).toBeFalsy()
    expect(document.querySelector('label[for="numberOfSiblings"]')).toBeFalsy()
    expect(document.querySelector('label[for="fingerCount"]')).toBeFalsy()
    expect(document.querySelector('label[for="atomCount"]')).toBeFalsy()
    expect(document.querySelector('label[for="height"]')).toBeFalsy()
    expect(document.querySelector('label[for="bmi"]')).toBeFalsy()
    expect(document.querySelector('label[for="birthdate"]')).toBeFalsy()
    expect(document.querySelector('label[for="deathdate"]')).toBeFalsy()
    expect(document.querySelector('label[for="birthtime"]')).toBeFalsy()
    expect(document.querySelector('label[for="deathtime"]')).toBeFalsy()
    expect(document.querySelector('label[for="hireDatetime"]')).toBeFalsy()
    expect(document.querySelector('label[for="isActive"]')).toBeFalsy()
    expect(document.querySelector('label[for="additionalData"]')).toBeFalsy()
    expect(document.querySelector('label[for="updatedDate"]')).toBeFalsy()

    await app.close()
  })

  it('Only one input per field', async () => {
    class UserAdmin extends AdminEntity {
      entity = User
    }

    @Module({
      imports: [TypeOrmModule.forFeature([User]), TestAuthModule, DefaultCoreModule],
      exports: [TypeOrmModule],
    })
    class RegisteredAdminEntityModule {
      constructor(private readonly adminSite: DefaultAdminSite) {
        adminSite.register('user', UserAdmin)
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule.forRoot({ entities: [User, Agency, Group] }),
        RegisteredAdminEntityModule,
      ],
    }).compile()

    const app = module.createNestApplication()
    await app.init()

    const userData = createTestUser({ firstName: 'Pallavi' })
    const userRepository: Repository<User> = app.get(getRepositoryToken(User))
    const user = await userRepository.save(userData)
    expect(await userRepository.findOneOrFail(user.id)).toBeDefined()

    const server = app.getHttpServer()
    const req = await request(server).get(`/admin/user/user/${user.id}/change`)

    document.documentElement.innerHTML = req.text

    expect(document.querySelector('label[for="firstName"]')).toBeTruthy()
    expect(document.querySelector('label[for="lastName"]')).toBeTruthy()
    expect(document.querySelector('label[for="gender"]')).toBeTruthy()
    expect(document.querySelector('label[for="createdDate"]')).toBeTruthy()
    expect(document.querySelector('label[for="password"]')).toBeTruthy()
    expect(document.querySelector('label[for="email"]')).toBeTruthy()
    expect(document.querySelector('label[for="roles"]')).toBeTruthy()
    expect(document.querySelector('label[for="moreRoles"]')).toBeTruthy()
    expect(document.querySelector('label[for="description"]')).toBeTruthy()
    expect(document.querySelector('label[for="agency"]')).toBeTruthy()
    expect(document.querySelector('label[for="groups"]')).toBeTruthy()
    expect(document.querySelector('label[for="age"]')).toBeTruthy()
    expect(document.querySelector('label[for="numberOfSiblings"]')).toBeTruthy()
    expect(document.querySelector('label[for="fingerCount"]')).toBeTruthy()
    expect(document.querySelector('label[for="atomCount"]')).toBeTruthy()
    expect(document.querySelector('label[for="height"]')).toBeTruthy()
    expect(document.querySelector('label[for="bmi"]')).toBeTruthy()
    expect(document.querySelector('label[for="birthdate"]')).toBeTruthy()
    expect(document.querySelector('label[for="deathdate"]')).toBeTruthy()
    expect(document.querySelector('label[for="birthtime"]')).toBeTruthy()
    expect(document.querySelector('label[for="deathtime"]')).toBeTruthy()
    expect(document.querySelector('label[for="hireDatetime"]')).toBeTruthy()
    expect(document.querySelector('label[for="isActive"]')).toBeTruthy()
    expect(document.querySelector('label[for="additionalData"]')).toBeTruthy()
    expect(document.querySelector('label[for="updatedDate"]')).toBeTruthy()

    await app.close()
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as request from 'supertest'
import { AdminCoreModuleFactory } from '../adminCore.module'
import { displayName } from '../admin.filters'
import { User } from '../../exampleApp/src/user/user.entity'
import { createTestUser } from './utils/entityUtils'
import { UserModule } from '../../exampleApp/src/user/user.module'
import { TestAuthModule } from './utils/testAuth.module'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import { Agency } from '../../exampleApp/src/user/agency.entity'
import { Group } from '../../exampleApp/src/user/group.entity'

describe('AppController', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule.forRoot({ entities: [User, Agency, Group] }),
        UserModule,
        TestAuthModule,
        AdminCoreModuleFactory.createAdminCoreModule({}),
      ],
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be defined', () => {
    expect(app).toBeDefined()
  })

  it('can delete a user', async () => {
    // add the user to the database
    const userData = createTestUser({ firstName: 'Max' })
    const userRepository: Repository<User> = app.get(getRepositoryToken(User))
    const user = await userRepository.save(userData)
    expect(await userRepository.findOneOrFail(user.id)).toBeDefined()

    // delete the user via the api call
    const server = app.getHttpServer()
    const req = await request(server).post(`/admin/user/user/${user.id}/delete`)
    expect(req.status).toBe(302)
    expect(req.header.location).toBe(`/admin/user/user`)

    const expectedDisplayName = displayName(user, userRepository.metadata)
    const res = await request(server)
      .get(`/admin/user/user`)
      .set('Cookie', req.get('Set-Cookie')[0])
    expect(res.text).toContain(`Successfully deleted User: ${expectedDisplayName}`)

    expect(await userRepository.findOne(user.id)).toBeUndefined()
  })
})

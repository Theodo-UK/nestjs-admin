import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import { UserModule } from '../../exampleApp/src/user/user.module'
import { TestAuthModule } from './utils/testAuth.module'
import { createTestUser } from './utils/entityUtils'
import { AdminCoreModuleFactory } from '../adminCore.module'
import { JSDOM } from 'jsdom'
import { Agency } from '../../exampleApp/src/user/agency.entity'
import { User } from '../../exampleApp/src/user/user.entity'
import { Group } from '../../exampleApp/src/user/group.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as dateFilter from 'nunjucks-date-filter'

describe('changelist', () => {
  let app: INestApplication
  let document: Document

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

  beforeEach(() => {
    const dom = new JSDOM()
    document = dom.window.document
  })

  it('can show the columns defined in listDisplay', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/user/user`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('table th:nth-child(1)').innerHTML.includes('id')).toBeTruthy()
    expect(
      document.querySelector('table th:nth-child(2)').innerHTML.includes('firstName'),
    ).toBeTruthy()
  })

  it('does not show a table when listDisplay is not defined', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/agency/agency`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('table > thead')).toBeFalsy()
  })

  it('shows date properties in the correct format', async () => {
    const server = app.getHttpServer()

    const userData = createTestUser({
      firstName: 'Max',
    })
    const userRepository: Repository<User> = app.get(getRepositoryToken(User))
    const user = await userRepository.save(userData)

    const res = await request(server).get(`/admin/user/user`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text

    // @debt bug "Generated datetimes are converted to UTC twice resulting in them displaying wrong if the nest app isn't in UTC"
    expect(
      document
        .querySelector(`table tr[data-entity-id="${user.id}"] td:nth-child(5)`)
        .innerHTML.includes(dateFilter(user.createdDate, 'YYYY-MM-DD hh:mm:ss')),
    ).toBeTruthy()
  })
})

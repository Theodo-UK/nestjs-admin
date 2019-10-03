import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import { UserModule } from '../../exampleApp/src/user/user.module'
import { TestAuthModule } from './utils/testAuth.module'
import { AdminCoreModuleFactory } from '../adminCore.module'
import { JSDOM } from 'jsdom'
import { Agency } from '../../exampleApp/src/user/agency.entity'
import { User } from '../../exampleApp/src/user/user.entity'
import { Group } from '../../exampleApp/src/user/group.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from '../utils/typeormSwitch'
import { createTestUser } from './utils/entityUtils'
import * as dateFilter from 'nunjucks-date-filter'

describe('changelist', () => {
  let app: INestApplication
  let document: Document
  let user1: User
  let user2: User
  let user3: User

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

    const userData1 = createTestUser({
      firstName: 'John',
      lastName: 'Smith',
    })
    const userData2 = createTestUser({
      firstName: 'Jane',
      lastName: 'Doe',
    })
    const userData3 = createTestUser({
      firstName: 'Will',
      lastName: 'Duc',
    })
    const userRepository: Repository<User> = app.get(getRepositoryToken(User))
    user1 = await userRepository.save(userData1)
    user2 = await userRepository.save(userData2)
    user3 = await userRepository.save(userData3)
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

  it('renders a search box when searchFields is defined', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/user/user`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('form input[name="search"]')).toBeTruthy()
  })

  it('does not render a search box when searchFields is undefined', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/agency/agency`)
    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('form input[name="search"]')).toBeFalsy()
  })

  it('shows date properties in the correct format', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/user/user`)
    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    // @debt bug "Generated datetimes are converted to UTC twice resulting in them displaying wrong if the nest app isn't in UTC"
    expect(
      document
        .querySelector('table tr:nth-child(1) td:nth-child(5)')
        .innerHTML.includes(dateFilter(user1.createdDate, 'YYYY-MM-DD hh:mm:ss')),
    ).toBeTruthy()
  })

  it('shows the correct user with a 1 word search term', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/user/user?search=John`)
    expect(res.status).toBe(200)
    document.documentElement.innerHTML = res.text

    const tableCellContents = Array.from(
      document.querySelectorAll('table tbody tr td:nth-child(1) a'),
    ).map(x => x.innerHTML)

    expect(tableCellContents.includes(user1.id.toString())).toBeTruthy()
    expect(tableCellContents.includes(user2.id.toString())).toBeFalsy()
    expect(tableCellContents.includes(user3.id.toString())).toBeFalsy()
  })

  it('shows the correct user with a 2 word search term', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/user/user?search=Jane+Doe`)
    expect(res.status).toBe(200)
    document.documentElement.innerHTML = res.text

    const tableCellContents = Array.from(
      document.querySelectorAll('table tbody tr td:nth-child(1) a'),
    ).map(x => x.innerHTML)

    expect(tableCellContents.includes(user1.id.toString())).toBeFalsy()
    expect(tableCellContents.includes(user2.id.toString())).toBeTruthy()
    expect(tableCellContents.includes(user3.id.toString())).toBeFalsy()
  })

  it('shows the correct users with a 2 word search term', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/user/user?search=J+o`)
    expect(res.status).toBe(200)
    document.documentElement.innerHTML = res.text

    const tableCellContents = Array.from(
      document.querySelectorAll('table tbody tr td:nth-child(1) a'),
    ).map(x => x.innerHTML)

    expect(tableCellContents.includes(user1.id.toString())).toBeTruthy()
    expect(tableCellContents.includes(user2.id.toString())).toBeTruthy()
    expect(tableCellContents.includes(user3.id.toString())).toBeFalsy()
  })
})

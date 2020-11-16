import * as request from 'supertest'
import { getEntityManagerToken } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import * as dateFilter from 'nunjucks-date-filter'
import { JSDOM } from 'jsdom'
import { createTestUser } from './utils/entityUtils'
import { Agency } from '../../exampleApp/src/user/agency.entity'
import { User } from '../../exampleApp/src/user/user.entity'
import { Group } from '../../exampleApp/src/user/group.entity'
import AdminEntity from '../adminCore/adminEntity'
import { createAndStartTestApp, TestApplication } from './utils/testApp'

export class UserAdmin extends AdminEntity {
  entity = User
  listDisplay = ['id', 'firstName', 'lastName', 'email', 'createdDate']
  searchFields = ['firstName', 'lastName']
}

describe('changelist', () => {
  let app: TestApplication
  let document: Document
  let user1: User
  let user2: User
  let user3: User

  beforeAll(async () => {
    app = await createAndStartTestApp({ registerEntities: [UserAdmin, Agency, Group] })
  })

  beforeEach(async () => {
    await app.startTest()
    const dom = new JSDOM()
    document = dom.window.document

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

    const entityManager: EntityManager = app.get(getEntityManagerToken())
    user1 = await entityManager.save(User, userData1)
    user2 = await entityManager.save(User, userData2)
    user3 = await entityManager.save(User, userData3)
  })

  afterEach(async () => {
    await app.stopTest()
  })

  afterAll(async () => {
    await app.close()
  })

  it('can show the columns defined in listDisplay', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/test/user`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('table th:nth-child(1)').innerHTML.includes('id')).toBeTruthy()
    expect(
      document.querySelector('table th:nth-child(2)').innerHTML.includes('firstName'),
    ).toBeTruthy()
  })

  it('does not show a table when listDisplay is not defined', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/test/agency`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('table > thead')).toBeFalsy()
  })

  it('renders a search box when searchFields is defined', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/test/user`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('form input[name="search"]')).toBeTruthy()
  })

  it('does not render a search box when searchFields is undefined', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/test/agency`)
    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('form input[name="search"]')).toBeFalsy()
  })

  it('shows date properties in the correct format', async () => {
    const server = app.getHttpServer()

    const user = createTestUser({
      firstName: 'Max',
    })
    const entityManager: EntityManager = app.get(getEntityManagerToken())
    await entityManager.save(user)

    const res = await request(server).get(`/admin/test/user`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    // @debt bug "Generated datetimes are converted to UTC twice resulting in them displaying wrong if the nest app isn't in UTC"
    expect(
      document
        .querySelector('table tr:nth-child(1) td:nth-child(5)')
        .innerHTML.includes(dateFilter(user1.createdDate, 'YYYY-MM-DD hh:mm:ss')),
    ).toBeTruthy()
    expect(document.body.innerHTML).not.toContain('NaN')
  })

  it('shows the correct user with a 1 word search term', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/test/user?search=John`)
    expect(res.status).toBe(200)
    document.documentElement.innerHTML = res.text

    const tableCellContents = Array.from(
      document.querySelectorAll('table tbody tr td:nth-child(1) a'),
    ).map((x) => x.innerHTML)

    expect(tableCellContents.includes(user1.id.toString())).toBeTruthy()
    expect(tableCellContents.includes(user2.id.toString())).toBeFalsy()
    expect(tableCellContents.includes(user3.id.toString())).toBeFalsy()
  })

  it('shows the correct user with a 2 word search term', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/test/user?search=Jane+Doe`)
    expect(res.status).toBe(200)
    document.documentElement.innerHTML = res.text

    const tableCellContents = Array.from(
      document.querySelectorAll('table tbody tr td:nth-child(1) a'),
    ).map((x) => x.innerHTML)

    expect(tableCellContents.includes(user1.id.toString())).toBeFalsy()
    expect(tableCellContents.includes(user2.id.toString())).toBeTruthy()
    expect(tableCellContents.includes(user3.id.toString())).toBeFalsy()
  })

  it('shows the correct users with a 2 word search term', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/test/user?search=J+o`)
    expect(res.status).toBe(200)
    document.documentElement.innerHTML = res.text

    const tableCellContents = Array.from(
      document.querySelectorAll('table tbody tr td:nth-child(1) a'),
    ).map((x) => x.innerHTML)

    expect(tableCellContents.includes(user1.id.toString())).toBeTruthy()
    expect(tableCellContents.includes(user2.id.toString())).toBeTruthy()
    expect(tableCellContents.includes(user3.id.toString())).toBeFalsy()
  })
})

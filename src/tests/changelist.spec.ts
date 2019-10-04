import * as request from 'supertest'
import { getEntityManagerToken } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import * as dateFilter from 'nunjucks-date-filter'
import { JSDOM } from 'jsdom'
import { createTestUser } from './utils/entityUtils'
import { Agency } from '../../exampleApp/src/user/agency.entity'
import { User } from '../../exampleApp/src/user/user.entity'
import { Group } from '../../exampleApp/src/user/group.entity'
import AdminEntity from '../adminEntity'
import { createAndStartTestApp, TestApplication } from './utils/testApp'

export class UserAdmin extends AdminEntity {
  entity = User
  listDisplay = ['id', 'firstName', 'lastName', 'email', 'createdDate']
}

describe('changelist', () => {
  let app: TestApplication
  let document: Document

  beforeAll(async () => {
    app = await createAndStartTestApp({ registerEntities: [UserAdmin, Agency, Group] })
  })

  beforeEach(async () => {
    await app.startTest()
    const dom = new JSDOM()
    document = dom.window.document
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

  it('shows date properties in the correct format', async () => {
    const server = app.getHttpServer()

    const userData = createTestUser({
      firstName: 'Max',
    })
    const entityManager: EntityManager = app.get(getEntityManagerToken())
    const user = await entityManager.save(userData)

    const res = await request(server).get(`/admin/test/user`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text

    // @debt bug "Generated datetimes are converted to UTC twice resulting in them displaying wrong if the nest app isn't in UTC"
    expect(
      document
        .querySelector('table tr:nth-child(1) td:nth-child(5)')
        .innerHTML.includes(dateFilter(user.createdDate, 'YYYY-MM-DD hh:mm:ss')),
    ).toBeTruthy()
  })
})

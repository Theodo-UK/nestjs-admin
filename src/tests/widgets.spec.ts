import * as request from 'supertest'
import { JSDOM } from 'jsdom'
import { User } from '../../exampleApp/src/user/user.entity'
import { createAndStartTestApp, TestApplication } from './utils/setup'

describe('widgets', () => {
  let app: TestApplication
  let document: Document

  beforeAll(async () => {
    app = await createAndStartTestApp({ registerEntities: [User] })
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

  it('renders all options for an enum', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/test/user/add`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('select[name="gender"]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value=""]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value="male"]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value="female"]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value="other"]')).toBeTruthy()
  })
})

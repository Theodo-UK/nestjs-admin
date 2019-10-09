import { EntityManager } from '../utils/typeormProxy'
import * as request from 'supertest'
import { JSDOM } from 'jsdom'
import { createTestAdminUser } from './utils/entityUtils'
import AdminUser from '../adminUser/adminUser.entity'
import { createAndStartTestApp, TestApplication } from './utils/testApp'
import { AdminUserModule } from '../adminUser/adminUser.module'

describe('login', () => {
  let app: TestApplication
  let document: Document
  let server: any

  beforeAll(async () => {
    app = await createAndStartTestApp({
      adminAuthModule: AdminUserModule,
    })
    server = app.getHttpServer()
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

  it('redirects to login when unauthenticated', async () => {
    const res = await request(server).get(`/admin/user/user`)
    expect(res.status).toBe(302)
    expect(res.header.location).toBe(`/admin/login`)
  })

  it('returns 302 when unauthenticated using POST', async () => {
    const res = await request(server).post(`/admin/user/user/add`)
    expect(res.status).toBe(302)
    expect(res.header.location).toBe(`/admin/login`)
  })

  it('renders a login page', async () => {
    const res = await request(server).get(`/admin/login`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('input[name="username"]')).toBeTruthy()
    expect(document.querySelector('input[name="password"][type="password"]')).toBeTruthy()
  })

  it('provides the styling', async () => {
    const res = await request(server).get(`/admin-static/scss/login.scss`)

    expect(res.status).toBe(200)
  })

  it('logs the admin in if entering correct credentials', async () => {
    // add the admin to the database
    const entityManager = app.get(EntityManager)

    const password = 'adminpassword'
    const adminData = createTestAdminUser({ password })
    const admin = await entityManager.save(adminData)
    expect(await entityManager.findOneOrFail(AdminUser, admin.id)).toBeDefined()

    const res = await request(server)
      .post(`/admin/login`)
      .send({ username: adminData.username, password })
    expect(res.status).toBe(302)
    expect(res.header.location).toBe(`/admin`)
  })
})

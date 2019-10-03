import { EntityManager } from 'typeorm'
import * as request from 'supertest'
import { JSDOM } from 'jsdom'
import { createTestAdminUser } from './utils/entityUtils'
import AdminUser from '../adminUser.entity'
import { createAndStartTestApp, TestApplication } from './utils/setup'
import { AdminAuthModuleFactory } from '../adminAuth.module'

describe('login', () => {
  let app: TestApplication
  let document: Document

  beforeAll(async () => {
    app = await createAndStartTestApp({
      adminAuthModule: AdminAuthModuleFactory.createAdminAuthModule({}),
    })
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
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/test/user`)
    expect(res.status).toBe(302)
    expect(res.header.location).toBe(`/admin/login`)
  })

  it('returns 302 when unauthenticated using POST', async () => {
    const server = app.getHttpServer()
    const res = await request(server).post(`/admin/test/user/add`)
    expect(res.status).toBe(302)
    expect(res.header.location).toBe(`/admin/login`)
  })

  it('renders a login page', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/login`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('input[name="username"][type="email"]')).toBeTruthy()
    expect(document.querySelector('input[name="password"][type="password"]')).toBeTruthy()
  })

  it('provides the styling', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin-static/scss/login.scss`)

    expect(res.status).toBe(200)
  })

  it('log the admin in if entering correct credentials', async () => {
    // add the admin to the database
    const entityManager = app.get(EntityManager)

    const password = 'adminpassword'
    const adminData = createTestAdminUser({ password })
    const admin = await entityManager.save(adminData)
    expect(await entityManager.findOneOrFail(AdminUser, admin.id)).toBeDefined()

    const server = app.getHttpServer()
    const res = await request(server)
      .post(`/admin/login`)
      .send({ username: adminData.email, password })
    expect(res.status).toBe(302)
    expect(res.header.location).toBe(`/admin`)
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import * as request from 'supertest'
import { JSDOM } from 'jsdom'
import { DefaultAdminModule } from '..'
import { createTestAdminUser } from './utils/entityUtils'
import AdminUser from '../adminUser.entity'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'

describe('login', () => {
  let app: INestApplication
  let document: Document

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestTypeOrmModule.forRoot(), DefaultAdminModule],
    }).compile()
    app = module.createNestApplication()
    await app.init()
  })

  beforeEach(() => {
    const dom = new JSDOM()
    document = dom.window.document
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be defined', async () => {
    expect(app).toBeDefined()
  })

  it('redirects to login when unauthenticated', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/user/user`)
    expect(res.status).toBe(302)
    expect(res.header.location).toBe(`/admin/login`)
  })

  it('returns 302 when unauthenticated using POST', async () => {
    const server = app.getHttpServer()
    const res = await request(server).post(`/admin/user/user/add`)
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

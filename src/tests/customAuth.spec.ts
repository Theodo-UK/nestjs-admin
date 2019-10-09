import { EntityManager } from '../utils/typeormProxy'
import * as request from 'supertest'
import { JSDOM } from 'jsdom'
import { createTestAdminUser } from './utils/entityUtils'
import AdminUser from '../adminUser.entity'
import { createAndStartTestApp, TestApplication } from './utils/testApp'
import { AdminAuthModuleFactory } from '../adminAuth.module'

const mockCredentialValidator = jest.fn().mockImplementation((username, password) => {
  return false
})

describe('custom authentication', () => {
  let app: TestApplication
  let document: Document
  let server: any

  beforeAll(async () => {
    app = await createAndStartTestApp({
      adminAuthModule: AdminAuthModuleFactory.createAdminAuthModule({
        credentialValidator: {
          useFactory: () => mockCredentialValidator,
        },
      }),
    })
    server = app.getHttpServer()
  })

  beforeEach(async () => {
    await app.startTest()
    const dom = new JSDOM()
    document = dom.window.document
    mockCredentialValidator.mockClear()
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

  it('logs the admin in if successful credential check', async () => {
    mockCredentialValidator.mockImplementationOnce(() => true)
    // add the admin to the database
    const entityManager = app.get(EntityManager)

    const password = 'adminpassword'
    const adminData = createTestAdminUser({ password, username: 'admin' })
    const admin = await entityManager.save(adminData)
    expect(await entityManager.findOneOrFail(AdminUser, admin.id)).toBeDefined()

    const res = await request(server)
      .post(`/admin/login`)
      .send({ username: adminData.username, password })
    expect(mockCredentialValidator).toHaveBeenCalledTimes(1)
    expect(mockCredentialValidator).toHaveBeenCalledWith(adminData.username, password)
    expect(mockCredentialValidator).toHaveReturnedWith(true)
    expect(res.status).toBe(302)
    expect(res.header.location).toBe(`/admin`)

    const res2 = await request(server)
      .get(`/admin`)
      .set('Cookie', res.get('Set-Cookie')[0])
    expect(res2.status).toBe(200)
  })

  it('does not log the admin in if unsuccessful credential check', async () => {
    mockCredentialValidator.mockImplementationOnce(() => false)
    // add the admin to the database
    const entityManager = app.get(EntityManager)

    const password = 'adminpassword'
    const adminData = createTestAdminUser({ password, username: 'notadmin' })
    const admin = await entityManager.save(adminData)
    expect(await entityManager.findOneOrFail(AdminUser, admin.id)).toBeDefined()

    const res = await request(server)
      .post(`/admin/login`)
      .send({ username: adminData.username, password })
    expect(mockCredentialValidator).toHaveBeenCalledTimes(1)
    expect(mockCredentialValidator).toHaveBeenCalledWith(adminData.username, password)
    expect(mockCredentialValidator).toHaveReturnedWith(false)
    expect(res.status).toBe(302)
    expect(res.header.location).toBe(`/admin/login`)
  })
})

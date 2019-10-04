import * as request from 'supertest'
import { createAndStartTestApp, TestApplication } from './utils/testApp'
import { User } from '../../exampleApp/src/user/user.entity'

const middlewareMock = (req, res, next) => {
  try {
    req.flash = jest.fn()
    next()
  } catch (e) {
    console.warn(e)
  }
}

const flashMock = jest.fn().mockImplementation(middlewareMock)
jest.mock('connect-flash', () => {
  return () => flashMock
})

const sessionMock = jest.fn().mockImplementation(middlewareMock)
jest.mock('express-session', () => {
  return () => sessionMock
})

const middlewares = [flashMock, sessionMock]

describe('Middlewares', () => {
  let app: TestApplication

  beforeAll(async () => {
    app = await createAndStartTestApp({ registerEntities: [User] })
  })

  beforeEach(async () => {
    await app.startTest()
  })

  afterEach(async () => {
    await app.stopTest()
    middlewares.forEach(middleware => {
      middleware.mockClear()
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be defined', () => {
    expect(app).toBeDefined()
  })

  it('should apply middlewares on /admin routes', async () => {
    const server = app.getHttpServer()
    middlewares.forEach(middleware => {
      expect(middleware).toHaveBeenCalledTimes(0)
    })

    await request(server).get(`/admin`)
    await request(server).get(`/admin/`)
    await request(server).get(`/admin/user`)

    middlewares.forEach(middleware => {
      expect(middleware).toHaveBeenCalledTimes(3)
    })
  })

  it('should not apply middlewares on non /admin routes', async () => {
    const server = app.getHttpServer()
    middlewares.forEach(middleware => {
      expect(middleware).toHaveBeenCalledTimes(0)
    })

    await request(server).get(`/admin2`)
    await request(server).get(`/`)
    await request(server).get(`/test`)

    middlewares.forEach(middleware => {
      expect(middleware).toHaveBeenCalledTimes(0)
    })
  })
})

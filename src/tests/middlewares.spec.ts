import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as request from 'supertest'
import { AdminCoreModuleFactory } from '../adminCore.module'

const middlewareMock = (req, res, next) => next()

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
  let app: INestApplication

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), AdminCoreModuleFactory.createAdminCoreModule({})],
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
    middlewares.forEach(middleware => {
      middleware.mockClear()
    })
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
